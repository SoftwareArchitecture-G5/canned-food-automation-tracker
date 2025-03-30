import {BarChart2, Calendar, CircleGauge, Clock, Cog, FileText, Github, Layout} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";


export default async function Home() {
    // import { auth } from '@clerk/nextjs/server'
    // const {getToken} = await auth();
    // const token = await getToken()
  return (
      <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="space-y-2">
                          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                              Welcome to Automation Tracker
                          </h1>
                          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                              Your central hub for managing automation processes in our canned food factory.
                          </p>
                      </div>
                      <div className="space-x-4">
                          <Button><CircleGauge />Access Dashboard</Button>
                          <Button variant="outline"><Github />View Github</Button>
                      </div>
                  </div>
              </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 shadow-md rounded-md">
              <div className="container px-4 md:px-6">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8">Key Features</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <Card>
                          <CardHeader>
                              <Cog className="h-8 w-8 mb-2" />
                              <CardTitle>Management Automation</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">
                                  Streamline factory operations with advanced automation tools.
                              </p>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardHeader>
                              <Clock className="h-8 w-8 mb-2" />
                              <CardTitle>Maintenance Tracking</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">
                                  Schedule and track maintenance for all factory equipment.
                              </p>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardHeader>
                              <Calendar className="h-8 w-8 mb-2" />
                              <CardTitle>Calendar & Notifications</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">
                                  Stay updated with integrated calendars and real-time alerts.
                              </p>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardHeader>
                              <FileText className="h-8 w-8 mb-2" />
                              <CardTitle>Data Export & Reports</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">
                                  Generate comprehensive reports for analysis and compliance.
                              </p>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardHeader>
                              <Layout className="h-8 w-8 mb-2" />
                              <CardTitle>Blueprint Design</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">
                                  Design and optimize factory layouts with our blueprint tools.
                              </p>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardHeader>
                              <BarChart2 className="h-8 w-8 mb-2" />
                              <CardTitle>Analytics Dashboard</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">
                                  Gain insights into production efficiency with real-time analytics.
                              </p>
                          </CardContent>
                      </Card>
                  </div>
              </div>
          </section>
      </main>
  );
}
