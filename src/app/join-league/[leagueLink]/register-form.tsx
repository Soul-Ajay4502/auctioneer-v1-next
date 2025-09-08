"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  MapPin,
  Phone,
  Users,
  Target,
  Zap,
  Camera,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { League } from "@/utils/common-types-utils";
import LeagueDetailsCard from "./league-details-card";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/config/axios-config";
import endpoints from "@/services/api-endpoints";
import { AxiosError, AxiosResponse } from "axios";
import { axiosErrorToast } from "@/utils/axios-error-toast.utils";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useGlobalStateStore } from "@/store/global-state.store";

const formSchema = z.object({
  player_name: z.string().min(1, "Player name is required"),
  place: z.string().optional(),
  whatsapp_no: z.string().min(10, "Enter valid WhatsApp number"),
  current_team: z.string().optional(),
  player_role: z.string().min(1, "Select player role"),
  batting_style: z.string().min(1, "Select batting style"),
  bowling_style: z.string().min(1, "Select bowling style"),
  player_photo: z.string().optional(),
  payment_screenshot: z.string().optional(),
  id_proof_url: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof formSchema>;

export default function RegisterForm({
  leagueDetails,
}: {
  leagueDetails: League;
}) {
  const { setAccessToken } = useAuthStore();
  const { setTokenExpiry, tokenExpiry } = useGlobalStateStore();

  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!tokenExpiry) return;

    // Convert minutes to actual expiry timestamp
    const expiryTimestamp = Date.now() + tokenExpiry * 60 * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = expiryTimestamp - now;

      if (remaining <= 0) {
        setTimeLeft("Expired");
        setTokenExpiry(null);
        clearInterval(timer);
        return;
      }

      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenExpiry, setTokenExpiry]);

  const registerPlayerMutation = useMutation({
    mutationFn: (values: PlayerFormValues) =>
      api.post(endpoints.players.registerPlayer, values),
    onSuccess: () => {
      setShowSuccessAlert(true);
      form.reset();
      form.clearErrors();
      setAccessToken(null);
      setTokenExpiry(null);
    },
    onError: (error: AxiosError) => {
      axiosErrorToast(error, "Failed to register player");
    },
  });
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player_name: "",
      place: "",
      whatsapp_no: "",
      current_team: "",
      player_role: "",
      batting_style: "",
      bowling_style: "",
      player_photo: "",
      payment_screenshot: "",
      id_proof_url: "",
    },
  });

  const onSubmit = (values: PlayerFormValues) => {
    const body = { ...values, league_id: leagueDetails.league_id };
    registerPlayerMutation.mutate(body);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-in fade-in zoom-in duration-500">
            <div className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Registration Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                Welcome to the league! Your registration has been submitted and
                is now under review.
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  You'll receive updates on your registration status via email
                  and WhatsApp.
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowSuccessAlert(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Got it, thanks! ✨
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Player Registration
          </h1>
          <LeagueDetailsCard leagueDetails={leagueDetails} />
        </div>
        {tokenExpiry && (
          <div className="flex gap-4 items-center mb-2">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-lg w-fit">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-slate-700">
                  {timeLeft === "Expired" ? (
                    <span className="text-red-600">Session Expired</span>
                  ) : (
                    <span>{timeLeft}</span>
                  )}
                </span>
              </div>
            </div>
            <div className="text-center  text-xs text-slate-500">
              <p>Session will automatically expire within 15 minutes.</p>
            </div>
          </div>
        )}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-600" />
              Player Details
            </CardTitle>
            <CardDescription className="text-slate-600">
              Fill in your information to complete the registration process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="player_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-500" />
                            Player Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="place"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            Place
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your location"
                              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="whatsapp_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-500" />
                            WhatsApp Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter WhatsApp number"
                              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="current_team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            Current Team
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter current team name"
                              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Playing Style Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                    Playing Style
                  </h3>

                  <FormField
                    control={form.control}
                    name="player_role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                          <Target className="h-4 w-4 text-slate-500" />
                          Player Role *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                              <SelectValue placeholder="Select your primary role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Batsman">Batsman</SelectItem>
                            <SelectItem value="Bowler">Bowler</SelectItem>
                            <SelectItem value="All-Rounder">
                              All-Rounder
                            </SelectItem>
                            <SelectItem value="Wicket-Keeper">
                              Wicket-Keeper
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="batting_style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-slate-500" />
                            Batting Style *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                                <SelectValue placeholder="Select batting style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Right-hand bat">
                                Right-hand bat
                              </SelectItem>
                              <SelectItem value="Left-hand bat">
                                Left-hand bat
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bowling_style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <Target className="h-4 w-4 text-slate-500" />
                            Bowling Style *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                                <SelectValue placeholder="Select bowling style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Right-arm fast">
                                Right-arm fast
                              </SelectItem>
                              <SelectItem value="Left-arm fast">
                                Left-arm fast
                              </SelectItem>
                              <SelectItem value="Right-arm spin">
                                Right-arm spin
                              </SelectItem>
                              <SelectItem value="Left-arm spin">
                                Left-arm spin
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                    Documents & Media
                  </h3>
                  <p className="text-sm text-slate-600">
                    Upload your documents and photos (optional)
                  </p>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="player_photo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <Camera className="h-4 w-4 text-slate-500" />
                            Player Photo URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter player photo URL"
                              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payment_screenshot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-500" />
                            Payment Screenshot URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter payment screenshot URL"
                              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="id_proof_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            ID Proof URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter ID proof URL"
                              className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Register
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-500">
          <p>Need help? Contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  );
}
