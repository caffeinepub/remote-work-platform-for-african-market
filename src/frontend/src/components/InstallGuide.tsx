import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Smartphone, Chrome, Share2, Plus, MoreVertical, Download } from 'lucide-react';
import { SiApple, SiAndroid } from 'react-icons/si';

interface InstallGuideProps {
  onClose: () => void;
}

export default function InstallGuide({ onClose }: InstallGuideProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Download className="w-6 h-6 text-primary" />
            Install AfricaWork App
          </DialogTitle>
          <DialogDescription>
            Add AfricaWork to your home screen for a native app experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Section */}
          <Card className="glass-effect border-primary/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Why Install?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Quick access from your home screen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Works offline with cached data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Full-screen experience without browser UI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Faster loading and better performance</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Installation Instructions */}
          <Tabs defaultValue="ios" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ios" className="gap-2">
                <SiApple className="w-4 h-4" />
                iOS / Safari
              </TabsTrigger>
              <TabsTrigger value="android" className="gap-2">
                <SiAndroid className="w-4 h-4" />
                Android / Chrome
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ios" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Open in Safari</p>
                      <p className="text-sm text-muted-foreground">
                        Make sure you're using Safari browser on your iPhone or iPad
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1 flex items-center gap-2">
                        Tap the Share button <Share2 className="w-4 h-4" />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Look for the share icon at the bottom of your screen (or top on iPad)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1 flex items-center gap-2">
                        Select "Add to Home Screen" <Plus className="w-4 h-4" />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Scroll down in the share menu and tap "Add to Home Screen"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">4</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Confirm Installation</p>
                      <p className="text-sm text-muted-foreground">
                        Tap "Add" in the top right corner to complete the installation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="android" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Open in Chrome</p>
                      <p className="text-sm text-muted-foreground">
                        Make sure you're using Chrome browser on your Android device
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1 flex items-center gap-2">
                        Tap the Menu button <MoreVertical className="w-4 h-4" />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Look for the three dots menu in the top right corner
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1 flex items-center gap-2">
                        Select "Add to Home screen" <Smartphone className="w-4 h-4" />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tap "Add to Home screen" or "Install app" from the menu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">4</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Confirm Installation</p>
                      <p className="text-sm text-muted-foreground">
                        Tap "Install" or "Add" to complete the installation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="glass-effect border-accent/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Chrome className="w-4 h-4 text-accent" />
                Other Browsers
              </h3>
              <p className="text-sm text-muted-foreground">
                For other browsers like Firefox, Edge, or Samsung Internet, look for similar "Add to Home Screen" or "Install" options in the browser menu.
              </p>
            </CardContent>
          </Card>

          <Button onClick={onClose} className="w-full" variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
