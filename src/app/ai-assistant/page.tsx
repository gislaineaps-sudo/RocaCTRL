"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrainCircuit, Sprout, PawPrint, Loader2, Sparkles, CheckCircle2, Mic } from "lucide-react"
import { getLivestockManagementAdvice } from "@/ai/flows/livestock-management-advice"
import { optimizedPlantingRecommendations } from "@/ai/flows/optimized-planting-recommendations"

export default function AIAssistant() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  // Estados para os inputs
  const [soilType, setSoilType] = useState("")
  const [weatherData, setWeatherData] = useState("")
  const [species, setSpecies] = useState("")
  const [age, setAge] = useState("")

  // Estado para UX do gravador
  const [listeningFor, setListeningFor] = useState<string | null>(null)

  const handleListen = (inputId: string, setterFn: React.Dispatch<React.SetStateAction<string>>) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Seu navegador não suporta reconhecimento de voz.")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListeningFor(inputId)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setterFn(prev => prev ? prev + ' ' + transcript : transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event.error)
      setListeningFor(null)
    }

    recognition.onend = () => {
      setListeningFor(null)
    }

    recognition.start()
  }

  const handlePlantingRecommendation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await optimizedPlantingRecommendations({
        soilType: soilType,
        weatherData: weatherData,
      })
      setResult({ type: 'planting', data: res })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLivestockAdvice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await getLivestockManagementAdvice({
        species: species,
        ageInMonths: parseInt(age),
      })
      setResult({ type: 'livestock', data: res })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
          <BrainCircuit className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary">Assistente IA RoçaCtrl</h1>
        <p className="text-muted-foreground text-lg">
          Insights inteligentes baseados em dados para maximizar sua produtividade rural.
        </p>
      </div>

      <Tabs defaultValue="planting" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
          <TabsTrigger value="planting" className="gap-2">
            <Sprout className="h-4 w-4" /> Recomendação de Cultivo
          </TabsTrigger>
          <TabsTrigger value="livestock" className="gap-2">
            <PawPrint className="h-4 w-4" /> Manejo de Rebanho
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planting">
          <Card>
            <CardHeader>
              <CardTitle>Planejamento de Safra Inteligente</CardTitle>
              <CardDescription>Informe as condições do seu terreno para receber sugestões de plantio.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlantingRecommendation} className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="soilType">Tipo de Solo</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 rounded-full ${listeningFor === 'soilType' ? 'text-red-500 animate-pulse bg-red-100' : 'text-muted-foreground'}`}
                      onClick={() => handleListen('soilType', setSoilType)}
                      title="Falar"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input 
                    id="soilType" 
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    placeholder="Ex: Argiloso, Arenoso, Fértil..." 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="weatherData">Dados Meteorológicos / Condições Locais</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 rounded-full ${listeningFor === 'weatherData' ? 'text-red-500 animate-pulse bg-red-100' : 'text-muted-foreground'}`}
                      onClick={() => handleListen('weatherData', setWeatherData)}
                      title="Falar"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea 
                    id="weatherData" 
                    value={weatherData}
                    onChange={(e) => setWeatherData(e.target.value)}
                    placeholder="Ex: Clima temperado, chuvas regulares no verão, média 25°C..." 
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Gerar Recomendação
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livestock">
          <Card>
            <CardHeader>
              <CardTitle>Consultoria de Manejo Animal</CardTitle>
              <CardDescription>Sugestões personalizadas para saúde e nutrição animal.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLivestockAdvice} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="species">Espécie</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className={`h-8 w-8 p-0 rounded-full ${listeningFor === 'species' ? 'text-red-500 animate-pulse bg-red-100' : 'text-muted-foreground'}`}
                        onClick={() => handleListen('species', setSpecies)}
                        title="Falar"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input 
                      id="species" 
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      placeholder="Ex: Bovino (Corte)" 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="age">Idade (Meses)</Label>
                    <Input 
                      id="age" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      type="number" 
                      placeholder="Ex: 12" 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Obter Orientações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="border-2 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-headline">
              <CheckCircle2 className="h-5 w-5" /> Análise da IA Concluída
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.type === 'planting' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Sugestões de Cultivo:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.data.cropSuggestions.map((c: string) => (
                      <span key={c} className="px-3 py-1 bg-white border border-primary/30 rounded-full text-sm font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Cronograma Sugerido:</h3>
                  <p className="text-sm bg-white p-4 rounded-lg border leading-relaxed">
                    {result.data.plantingSchedule}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Justificativa Técnica:</h3>
                  <p className="text-sm italic leading-relaxed">
                    {result.data.justification}
                  </p>
                </div>
              </>
            )}

            {result.type === 'livestock' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Plano de Alimentação:</h3>
                  <p className="text-sm bg-white p-4 rounded-lg border leading-relaxed">
                    {result.data.feedingPlan}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Alertas de Saúde:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.data.healthAlerts.map((alert: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">{alert}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary">Conselho Geral:</h3>
                  <p className="text-sm italic leading-relaxed">
                    {result.data.generalAdvice}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
