import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserPayments, useProcessPayment } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Coins, Plus, TrendingUp } from 'lucide-react';
import { SiBitcoin } from 'react-icons/si';
import { toast } from 'sonner';

export default function PaymentDashboard() {
  const { identity } = useInternetIdentity();
  const { data: payments = [], isLoading } = useGetUserPayments();
  const processMutation = useProcessPayment();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'BTC',
    paymentModel: 'per-hour',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user: identity.getPrincipal(),
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      paymentModel: formData.paymentModel,
      timestamp: BigInt(Date.now() * 1000000),
      status: 'completed',
    };

    try {
      await processMutation.mutateAsync(transaction);
      toast.success('Payment processed successfully!');
      setShowPaymentForm(false);
      setFormData({ amount: '', currency: 'BTC', paymentModel: 'per-hour' });
    } catch (error) {
      toast.error('Failed to process payment');
      console.error(error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-2xl font-bold">{totalEarnings.toFixed(4)} BTC</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Methods</p>
                <p className="text-2xl font-bold">Crypto</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <SiBitcoin className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Track your cryptocurrency payments</CardDescription>
            </div>
            <Button 
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="gradient-primary shadow-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPaymentForm && (
            <Card className="mb-6 border-primary/20">
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.0001"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.0000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentModel">Payment Model *</Label>
                      <Select value={formData.paymentModel} onValueChange={(value) => setFormData({ ...formData, paymentModel: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per-hour">Per Hour</SelectItem>
                          <SelectItem value="per-project">Per Project</SelectItem>
                          <SelectItem value="per-test">Per Test</SelectItem>
                          <SelectItem value="per-minute">Per Minute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      className="gradient-primary shadow-glow"
                      disabled={processMutation.isPending}
                    >
                      {processMutation.isPending ? 'Processing...' : 'Process Payment'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowPaymentForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
              <p className="text-muted-foreground">
                Your payment history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <SiBitcoin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {payment.amount.toFixed(4)} {payment.currency}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.paymentModel.replace('-', ' ')} • {formatDate(payment.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default">{payment.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
