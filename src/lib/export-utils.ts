/**
 * Utilitários para exportação de dados em CSV e impressão
 */

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) {
    alert("Nenhum dado para exportar.")
    return
  }

  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(";"),
    ...rows.map(row =>
      headers
        .map(header => {
          const val = row[header] === undefined || row[header] === null ? "" : String(row[header])
          // Escapar aspas duplas e envolver em aspas
          return `"${val.replace(/"/g, '""')}"`
        })
        .join(";")
    )
  ].join("\r\n")

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function printSection(title: string) {
  if (typeof window !== "undefined") {
    window.print()
  }
}
