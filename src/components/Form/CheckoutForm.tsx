"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, MapPin, Phone, Building2, ArrowRight, CreditCard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CheckoutFormValues, CheckoutSchema } from '@/schemas/checkout'
import { checkoutOrder } from '@/services/api'

interface CheckoutFormProps {
    cartID: string
}

export default function CheckoutForm({ cartID }: CheckoutFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(CheckoutSchema),
        defaultValues: {
            details: "",
            phone: "",
            city: ""
        },
    });

    const inputs = [
        { 
            label: "Delivery Details", 
            placeholder: "Apartment, Studio, or Floor", 
            type: "text", 
            name: "details" as const, 
            icon: MapPin 
        },
        { 
            label: "Phone Number", 
            placeholder: "+20 1xx xxx xxxx", 
            type: "tel", 
            name: "phone" as const, 
            icon: Phone 
        },
        { 
            label: "City", 
            placeholder: "Cairo, Giza, etc.", 
            type: "text", 
            name: "city" as const, 
            icon: Building2 
        },
    ]

    const onSubmit = async (values: CheckoutFormValues) => {
        setIsSubmitting(true)
        try {
            const response = await checkoutOrder(cartID, values);
            if (response.status === "success" && response.session?.url) {
                window.location.href = response.session.url
            }
        } catch (error) {
            console.error("Checkout failed:", error)
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    {inputs.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <FormField
                                    control={form.control}
                                    name={item.name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                                {item.label}
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                                        <Icon size={18} />
                                                    </div>
                                                    <Input
                                                        {...field}
                                                        type={item.type}
                                                        placeholder={item.placeholder}
                                                        className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium text-slate-900 placeholder:text-slate-400"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="ml-1 text-xs font-medium" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                >
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-xl bg-[#003c1b] hover:bg-[#003c1b]/90 text-white shadow-lg shadow-primary/25 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        <div className="relative flex items-center justify-center gap-3">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="font-bold text-lg">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} className="text-emerald-200" />
                                    <span className="font-bold text-lg">Pay Now</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </Button>
                    
                    <p className="text-center text-[10px] text-slate-400 font-medium mt-4">
                        By clicking pay, you agree to our Terms & Conditions
                    </p>
                </motion.div>
            </form>
        </Form>
    )
}
