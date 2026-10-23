"use client"

import { PlanType } from "@/lib/db"

export type GooglePlaySkuId = "rocactrl_pro_mensal" | "rocactrl_iot_mensal"

declare global {
  interface Window {
    getDigitalGoodsService?: (serviceProvider: string) => Promise<{
      getDetails: (skus: string[]) => Promise<any[]>
      listPurchases: () => Promise<any[]>
      listPurchaseHistory?: () => Promise<any[]>
      acknowledge?: (purchaseToken: string, type?: string) => Promise<void>
      consume?: (purchaseToken: string) => Promise<void>
    }>
  }
}

/**
 * Aciona o pagamento nativo via Google Play Billing (Digital Goods API + PaymentRequest)
 * quando o RoçaCtrl está rodando dentro do aplicativo Android instalado (TWA).
 */
export async function assinarPlanoGoogle(
  skuId: GooglePlaySkuId,
  onSuccessUpgrade?: (newPlan: PlanType, purchaseToken?: string) => Promise<void> | void
): Promise<boolean> {
  const targetPlan: PlanType = skuId === "rocactrl_pro_mensal" ? "pro" : "iot"
  const priceValue = skuId === "rocactrl_pro_mensal" ? "9.90" : "24.90"

  if (typeof window !== "undefined" && "getDigitalGoodsService" in window && window.getDigitalGoodsService) {
    try {
      const service = await window.getDigitalGoodsService("https://play.google.com/billing")

      const paymentMethodData = [
        {
          supportedMethods: "https://play.google.com/billing",
          data: { sku: skuId }, // 'rocactrl_pro_mensal' ou 'rocactrl_iot_mensal'
        },
      ]

      const paymentDetails = {
        total: {
          label: "Total",
          amount: { currency: "BRL", value: priceValue },
        },
      }

      const request = new PaymentRequest(paymentMethodData, paymentDetails)
      const paymentResponse = await request.show()
      const { purchaseToken } = (paymentResponse.details || {}) as { purchaseToken?: string }

      // Confirma o recebimento da assinatura com o Google Play
      if (purchaseToken && typeof service.acknowledge === "function") {
        await service.acknowledge(purchaseToken, "repeatable")
      }
      await paymentResponse.complete("success")

      // Atualiza o status do produtor no banco de dados (Firestore + Local)
      if (onSuccessUpgrade) {
        await onSuccessUpgrade(targetPlan, purchaseToken)
      }

      alert("Assinatura ativada com sucesso!")
      window.location.reload()
      return true
    } catch (err) {
      console.error("Pagamento cancelado ou erro:", err)
      return false
    }
  } else {
    // Caso o usuário acesse pelo navegador comum do computador ou iPhone
    alert("Para assinar via Google Play, acesse o RoçaCtrl pelo nosso aplicativo Android!")
    return false
  }
}
