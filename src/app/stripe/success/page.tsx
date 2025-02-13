"use client"

import { CheckCircle, CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderDetails } from '@/utils/Payement/PaymentType';

export default function SuccessPage() {
  const router = useRouter()

  const [orderDetails, setOrderDetails] = useState<OrderDetails>()

  useEffect(() => {
    const order = localStorage.getItem("article")
    if (order) {
      const details = OrderDetails.find((item) => item.identity === order)
      console.log(details)

      setOrderDetails(details)
      localStorage.removeItem("article")
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Thank you for your purchase. Your order has been processed
            successfully.
          </p>
          <div className="rounded-lg bg-gray-100 p-3">
            <h2 className="mb-2 text-lg font-semibold">Order details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">{orderDetails?.name}</span>
              </div>
              {orderDetails?.priceDetails && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payement:</span>
                  <span className="font-medium">
                    {orderDetails?.priceDetails}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{orderDetails?.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                  color="green"
                />
                <span className="text-sm font-medium text-green-500">
                  {orderDetails?.update}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Return to pandorra
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
