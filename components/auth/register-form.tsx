"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/app/register/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  lastName: string;
  firstName: string;
  birthYear: string;
  address: string;
}

interface FormErrors {
  lastName?: string;
  firstName?: string;
  birthYear?: string;
  address?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.lastName.trim()) {
    errors.lastName = "A vezetéknév megadása kötelező.";
  }
  if (!data.firstName.trim()) {
    errors.firstName = "A keresztnév megadása kötelező.";
  }
  if (!data.address.trim()) {
    errors.address = "A lakcím megadása kötelező.";
  }

  const year = parseInt(data.birthYear, 10);
  if (!data.birthYear.trim()) {
    errors.birthYear = "A születési év megadása kötelező.";
  } else if (isNaN(year) || year < 1940 || year > 2010) {
    errors.birthYear = "A születési év 1940 és 2010 között legyen.";
  }

  return errors;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    birthYear: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        lastName: formData.lastName.trim(),
        firstName: formData.firstName.trim(),
        birthYear: parseInt(formData.birthYear, 10),
        address: formData.address.trim(),
      });

      if (result.error) {
        setSubmitError(result.error);
        return;
      }

      router.push("/app/events");
    } catch {
      setSubmitError("Hiba történt a mentés során. Próbáld újra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-zinc-300">
          Vezetéknév
        </Label>
        <Input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          placeholder="Kovács"
          autoFocus
        />
        {errors.lastName && (
          <p className="text-xs text-red-400">{errors.lastName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-zinc-300">
          Keresztnév
        </Label>
        <Input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          placeholder="János"
        />
        {errors.firstName && (
          <p className="text-xs text-red-400">{errors.firstName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthYear" className="text-zinc-300">
          Születési év
        </Label>
        <Input
          id="birthYear"
          type="number"
          min={1940}
          max={2010}
          value={formData.birthYear}
          onChange={(e) => handleChange("birthYear", e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          placeholder="1995"
        />
        {errors.birthYear && (
          <p className="text-xs text-red-400">{errors.birthYear}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-zinc-300">
          Lakcím
        </Label>
        <Input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          placeholder="Budapest, Fő utca 1."
        />
        {errors.address && (
          <p className="text-xs text-red-400">{errors.address}</p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-red-400">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-dozis-amber text-black hover:bg-dozis-amber-light font-body font-semibold"
        size="lg"
      >
        {loading ? "Mentés..." : "Profil mentése"}
      </Button>
    </form>
  );
}
