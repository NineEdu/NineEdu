"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  UserCircle,
  KeyRound,
  Save,
  Loader2,
  Camera,
  Mail,
  UploadCloud,
  Trash2,
  ShieldCheck,
  History,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { UploadV3 } from "@/shared/components//UploadV3";

import { useCurrentUser } from "@/hooks/useAuth";
import useUpdateProfile from "@/hooks/users/useUpdateProfile";
import useChangePassword from "@/hooks/users/useChangePassword";

// schemas
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  avatar: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function UserProfilePage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  //@ts-ignore
  const { updateProfile, isUpdating } = useUpdateProfile();
  //@ts-ignore
  const { changePassword, isChanging } = useChangePassword();

  // form profile
  const formProfile = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      avatar: "",
    },
  });

  // sync data
  useEffect(() => {
    if (user) {
      formProfile.reset({
        fullName: user.fullName || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, formProfile]);

  const onUpdateProfile = (values: any) => {
    updateProfile(values);
  };

  // form password
  const formPassword = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onChangePassword = (values: any) => {
    changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => formPassword.reset(),
      }
    );
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 font-sans text-sm bg-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your account and preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="rounded-sm bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 font-medium border border-gray-200 shadow-none">
              {user?.role || "Member"}
            </Badge>
          </div>
        </div>

        {/* main tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start bg-transparent p-0 mb-8 border-b border-gray-200 h-auto gap-6">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black px-0 pb-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-all gap-2 shadow-none bg-transparent"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black px-0 pb-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-all gap-2 shadow-none bg-transparent"
            >
              Security
            </TabsTrigger>
            {user?.role === "student" && (
              <TabsTrigger
                value="history"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black px-0 pb-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-all gap-2 shadow-none bg-transparent"
              >
                Billing
              </TabsTrigger>
            )}
          </TabsList>

          {/* general content */}
          <TabsContent
            value="general"
            className="animate-in fade-in-50 duration-300 space-y-0"
          >
            <div className="grid gap-8 md:grid-cols-12">
              {/* left col: avatar */}
              <div className="md:col-span-4 border border-gray-200 rounded-md p-6 h-fit">
                <UploadV3
                  name="avatar"
                  control={formProfile.control}
                  className="w-full flex flex-col items-center"
                >
                  {(state, actions) => (
                    <>
                      <div
                        className="relative group mb-6 cursor-pointer"
                        onClick={actions.onBrowse}
                      >
                        {/* avatar */}
                        <Avatar className="w-32 h-32 rounded-full border border-gray-100">
                          <AvatarImage
                            src={state.value || ""}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gray-50 text-gray-400 text-4xl font-bold">
                            {user?.fullName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>

                        {/* loading overlay */}
                        {state.isUploading && (
                          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center z-20">
                            <Loader2 className="w-8 h-8 text-black animate-spin" />
                          </div>
                        )}

                        {/* hover overlay */}
                        {!state.isUploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-[1px]">
                            {state.isDragging ? (
                              <UploadCloud className="w-8 h-8 text-white mb-1" />
                            ) : (
                              <Camera className="w-8 h-8 text-white mb-1" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                          {user?.fullName}
                        </h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <div className="flex gap-2 w-full">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={actions.onBrowse}
                          disabled={state.isUploading}
                        >
                          Change
                        </Button>
                        {state.value && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-md border-gray-300 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              actions.onRemove();
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </UploadV3>
              </div>

              {/* right col: form */}
              <div className="md:col-span-8 border border-gray-200 rounded-md p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Profile</h3>
                  <p className="text-sm text-gray-500">
                    Update your personal information.
                  </p>
                </div>

                <Form {...formProfile}>
                  <form
                    onSubmit={formProfile.handleSubmit(onUpdateProfile)}
                    className="space-y-5 max-w-lg"
                  >
                    <FormField
                      control={formProfile.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-md border-gray-300 focus-visible:ring-black h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2 opacity-75">
                      <FormLabel className="text-gray-700 font-medium">
                        Email Address
                      </FormLabel>
                      <div className="flex items-center gap-3 px-3 h-10 bg-gray-50 border border-gray-200 rounded-md text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-black hover:bg-gray-800 text-white rounded-md h-10 px-6 font-medium"
                      >
                        {isUpdating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </TabsContent>

          {/* security content */}
          <TabsContent
            value="security"
            className="animate-in fade-in-50 duration-300"
          >
            <div className="grid md:grid-cols-12 gap-8">
              {/* security tips */}
              <div className="md:col-span-4">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-900 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Secure Account
                      </h4>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        Use a strong password with symbols and numbers to keep
                        your account safe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* password form */}
              <div className="md:col-span-8 border border-gray-200 rounded-md p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">
                    Change your current password.
                  </p>
                </div>

                <Form {...formPassword}>
                  <form
                    onSubmit={formPassword.handleSubmit(onChangePassword)}
                    className="space-y-5 max-w-lg"
                  >
                    <FormField
                      control={formPassword.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Current Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="rounded-md border-gray-300 focus-visible:ring-black h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="bg-gray-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={formPassword.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              New Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                className="rounded-md border-gray-300 focus-visible:ring-black h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formPassword.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                className="rounded-md border-gray-300 focus-visible:ring-black h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isChanging}
                        className="bg-black hover:bg-gray-800 text-white rounded-md h-10 px-6 font-medium"
                      >
                        {isChanging ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </TabsContent>

          {/* history content */}
          <TabsContent value="history">
            <div className="border border-gray-200 rounded-md p-12 text-center bg-gray-50/50">
              <History className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-gray-900">
                No purchase history
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                You haven't bought any courses yet.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
