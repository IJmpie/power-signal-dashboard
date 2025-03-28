
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import HeaderAttribution from "@/components/HeaderAttribution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
  password: z.string().min(6, { message: "Wachtwoord moet minstens 6 tekens bevatten" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
  password: z.string().min(6, { message: "Wachtwoord moet minstens 6 tekens bevatten" }),
  confirmPassword: z.string().min(6, { message: "Wachtwoord moet minstens 6 tekens bevatten" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onLoginSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignupSubmit(data: SignupFormValues) {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password);
      setActiveTab("login");
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetSubmit(data: ResetFormValues) {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setActiveTab("login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background flex flex-col items-center pt-8 pb-16">
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <HeaderAttribution />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Stroomprijs Stoplicht
        </h1>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Inloggen" : activeTab === "signup" ? "Registreren" : "Wachtwoord resetten"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" 
                ? "Voer je gegevens in om toegang te krijgen" 
                : activeTab === "signup" 
                ? "Maak een nieuw account aan"
                : "Voer je e-mail in om je wachtwoord te resetten"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">Inloggen</TabsTrigger>
                <TabsTrigger value="signup">Registreren</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="naam@voorbeeld.nl" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wachtwoord</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Inloggen..." : "Inloggen"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground"
                    onClick={() => setActiveTab("reset")}
                  >
                    Wachtwoord vergeten?
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="naam@voorbeeld.nl" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wachtwoord</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wachtwoord bevestigen</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Registreren..." : "Registreren"}
                      <UserPlus className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="reset" className="space-y-4">
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="naam@voorbeeld.nl" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Link versturen..." : "Reset link versturen"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setActiveTab("login")}
                    >
                      Terug naar inloggen
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
