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
    errors.lastName = "A vezeteknev megadasa kotelezo.";
  }
  if (!data.firstName.trim()) {
    errors.firstName = "A keresztnev megadasa kotelezo.";
  }
  if (!data.address.trim()) {
    errors.address = "A lakcim megadasa kotelezo.";
  }

  const year = parseInt(data.birthYear, 10);
  if (!data.birthYear.trim()) {
    errors.birthYear = "A szuletesi ev megadasa kotelezo.";
  } else if (isNaN(year) || year < 1940 || year > 2010) {
    errors.birthYear = "A szuletesi ev 1940 es 2010 kozott legyen.";
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

      router.push("/app");
    } catch {
      setSubmitError("Hiba tortent a mentes soran. Probald ujra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-zinc-300">
          Vezeteknev
        </Label>
        <Input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          placeholder="Kovacs"
          autoFocus
        />
        {errors.lastName && (
          <p className="text-xs text-red-400">{errors.lastName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-zinc-300">
          Keresztnev
        </Label>
        <Input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          placeholder="Janos"
        />
        {errors.firstName && (
          <p className="text-xs text-red-400">{errors.firstName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthYear" className="text-zinc-300">
          Szuletesi ev
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
          Lakcim
        </Label>
        <Input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          disabled={loading}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-dozis-amber"
          placeholder="Budapest, Fo utca 1."
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
        {loading ? "Mentes..." : "Profil mentese"}
      </Button>
    </form>
  );
}
