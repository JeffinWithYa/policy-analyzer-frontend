'use client'

import { useState } from 'react'
import { Check, Shield, ChevronDown, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

const policies = [
    { id: 1, name: "Standard Policy" },
    { id: 2, name: "Enhanced Policy" },
    { id: 3, name: "Premium Policy" },
]

const gdprCriteria = [
    { id: 1, label: "Lawful Basis for Processing" },
    { id: 2, label: "Consent" },
    { id: 3, label: "Data Subject Rights" },
    { id: 4, label: "Privacy by Design" },
    { id: 5, label: "Data Breach Notification" },
    { id: 6, label: "Data Protection Officer" },
    { id: 7, label: "International Data Transfers" },
    { id: 8, label: "Records of Processing Activities" },
]

const policyClauses = {
    1: {
        1: "We process personal data based on legitimate interests...",
        2: "We obtain explicit consent for processing sensitive data...",
        3: "Data subjects have the right to access, rectify, and erase their personal data...",
        4: "Our systems are designed with privacy in mind from the ground up...",
        5: "In the event of a data breach, we will notify the relevant authorities within 72 hours...",
        6: "We have appointed a Data Protection Officer to oversee GDPR compliance...",
        7: "For international data transfers, we use Standard Contractual Clauses...",
        8: "We maintain detailed records of all our data processing activities...",
    },
    2: {
        1: "Our lawful basis for processing includes contract fulfillment, legal obligations...",
        2: "We use a double opt-in process for obtaining consent...",
        3: "We provide a self-service portal for data subjects to exercise their rights...",
        4: "Regular privacy impact assessments are conducted on all new projects...",
        5: "Our data breach response plan includes immediate customer notification...",
        6: "Our DPO is available for direct consultation with data subjects...",
        7: "We use Binding Corporate Rules for intra-group data transfers...",
        8: "Our records of processing activities are regularly audited and updated...",
    },
    3: {
        1: "We have a comprehensive data processing framework based on multiple legal bases...",
        2: "Granular consent options are provided for each data processing activity...",
        3: "Automated systems are in place to fulfill data subject requests within 24 hours...",
        4: "Privacy-enhancing technologies are integrated into all our data processing systems...",
        5: "Real-time breach detection and notification systems are in place...",
        6: "We have a team of DPOs specializing in different aspects of data protection...",
        7: "We use a combination of SCCs, BCRs, and adequacy decisions for international transfers...",
        8: "Our records of processing activities are linked to a live data inventory system...",
    },
}

export default function Component() {
    const [selectedPolicy, setSelectedPolicy] = useState(policies[0])
    const [checkedItems, setCheckedItems] = useState<number[]>([])
    const [userPolicy, setUserPolicy] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handlePolicyChange = (policyId: number) => {
        const newPolicy = policies.find(p => p.id === policyId)
        if (newPolicy) {
            setSelectedPolicy(newPolicy)
        }
    }

    const handleCheckboxChange = (criteriaId: number) => {
        setCheckedItems(prev =>
            prev.includes(criteriaId)
                ? prev.filter(id => id !== criteriaId)
                : [...prev, criteriaId]
        )
    }

    const progressPercentage = (checkedItems.length / gdprCriteria.length) * 100

    const handleAnalyzePolicy = async () => {
        if (!userPolicy.trim()) return

        setIsAnalyzing(true)
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ policyText: userPolicy })
            })

            if (!response.ok) {
                throw new Error('Analysis failed')
            }

            const data = await response.json()
            console.log('Analysis complete:', data)

            // Handle the results here (e.g., update UI, store in state, etc.)

        } catch (error) {
            console.error('Failed to analyze policy:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                    <Shield className="w-10 h-10 text-primary mr-2" />
                    <h1 className="text-3xl font-bold text-primary">GDPR Policy Compliance Checker</h1>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full mb-4">
                                {selectedPolicy.name}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                            {policies.map((policy) => (
                                <DropdownMenuItem
                                    key={policy.id}
                                    onSelect={() => handlePolicyChange(policy.id)}
                                >
                                    {policy.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Progress value={progressPercentage} className="mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                        {checkedItems.length} of {gdprCriteria.length} criteria met
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="w-full md:w-1/2">
                        <ScrollArea className="h-[500px] rounded-lg border bg-white p-4">
                            {gdprCriteria.map((criteria) => (
                                <div key={criteria.id} className="flex items-center space-x-2 mb-4">
                                    <Checkbox
                                        id={`checkbox-${criteria.id}`}
                                        checked={checkedItems.includes(criteria.id)}
                                        onCheckedChange={() => handleCheckboxChange(criteria.id)}
                                        className="border-primary"
                                    />
                                    <label
                                        htmlFor={`checkbox-${criteria.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {criteria.label}
                                    </label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    <div className="w-full md:w-1/2">
                        <ScrollArea className="h-[500px] rounded-lg border bg-white p-4">
                            <h2 className="text-xl font-semibold mb-4 text-primary">Policy Clauses</h2>
                            {checkedItems.length === 0 ? (
                                <p className="text-gray-500 italic">Select criteria to view corresponding policy clauses.</p>
                            ) : (
                                checkedItems.map((criteriaId) => (
                                    <div key={criteriaId} className="mb-6 last:mb-0">
                                        <h3 className="font-medium text-primary mb-2">{gdprCriteria.find(c => c.id === criteriaId)?.label}</h3>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                            {policyClauses[selectedPolicy.id][criteriaId] || "No specific clause found for this criteria."}
                                        </p>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-primary">Your Privacy Policy</h2>
                    <Textarea
                        placeholder="Paste your privacy policy here for analysis..."
                        value={userPolicy}
                        onChange={(e) => setUserPolicy(e.target.value)}
                        className="min-h-[200px] mb-4"
                    />
                    <Button
                        onClick={handleAnalyzePolicy}
                        disabled={isAnalyzing || !userPolicy.trim()}
                        className="w-full"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            'Analyze Policy'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}