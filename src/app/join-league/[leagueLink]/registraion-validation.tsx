import { AlertTriangle, Shield, CreditCard, MapPin, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function RegistrationValidationCompact() {
    return (
        <Alert className="w-full mx-auto border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="space-y-3">
                <div className="font-medium text-amber-800 mb-2">Registration Valid Only:</div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-left">Admin approval required for complete registration</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-left">Valid payment screenshot needed for admin approval</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-left">
                            Location must match league and ID proof for admin approval
                        </span>
                    </div>
                </div>
            </AlertDescription>
        </Alert>
    )
}

function RegistrationValidation() {
    const validationRules = [
        {
            icon: Shield,
            title: 'Admin Approval Required',
            description: 'Your registration is not valid until you have been approved by the league admin.',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            icon: CreditCard,
            title: 'Payment Verification',
            description: 'Your registration is not valid if the payment screenshot is not valid.',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
        },
        {
            icon: MapPin,
            title: 'Location Verification',
            description: 'Your registration is not valid if the location mismatches with the league location and ID proof.',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
        },
    ]

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            {/* Header Alert */}
            <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 font-medium">
                    Important: Please review the registration validation requirements below
                </AlertDescription>
            </Alert>

            {/* Validation Rules */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Registration Validation Requirements
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {validationRules.map((rule, index) => {
                        const IconComponent = rule.icon
                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-l-4 ${rule.bgColor} ${rule.borderColor} hover:shadow-sm transition-shadow`}>
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-full bg-white shadow-sm`}>
                                        <IconComponent className={`h-4 w-4 ${rule.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold text-sm ${rule.color} mb-1`}>{rule.title}</h3>
                                        <p className="text-slate-700 text-sm leading-relaxed">{rule.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="text-center">
                <p className="text-xs text-slate-500">Ensure all requirements are met to avoid registration delays</p>
            </div>
        </div>
    )
}

export { RegistrationValidationCompact, RegistrationValidation }
