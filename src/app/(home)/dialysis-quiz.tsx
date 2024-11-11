"use client";

import { CenterCard } from "@/components/center-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CITIES, SECTOR, STATES, TREATMENT_TYPES } from "@/constants";
import { PopiconsPinDuotone } from "@popicons/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  SearchX,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

interface QuizStep {
  question: string;
  options: string[];
  param: string;
}

const HEPATITIS_OPTIONS = ["Tiada Hepatitis", "Hepatitis B", "Hepatitis C"];

// Malaysia bounds from map-view.tsx
const MALAYSIA_BOUNDS = {
  sw: [99.6435, 0.8527],
  ne: [119.2678, 7.3529],
};

// Add this helper function to get the formatted value
const getFormattedValue = (param: string | null) => {
  if (!param) return null;
  const decoded = decodeURIComponent(param);
  const v = decoded.includes("-")
    ? decoded
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : decoded
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  return v;
};

export function DialysisQuiz({ initialData }: { initialData: any }) {
  const [showResults, setShowResults] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [stateParam, setStateParam] = useQueryState("state", {
    shallow: false,
  });
  const [cityParam, setCityParam] = useQueryState("city", {
    shallow: false,
  });
  const [treatmentParam, setTreatmentParam] = useQueryState("treatment", {
    shallow: false,
  });
  const [hepatitisParam, setHepatitisParam] = useQueryState("hepatitis", {
    shallow: false,
  });
  const [sectorParam, setSectorParam] = useQueryState("sector", {
    shallow: false,
  });

  const state = getFormattedValue(stateParam);

  const steps: QuizStep[] = useMemo(
    () => [
      {
        question: "Di manakah lokasi anda?",
        options: STATES.slice(1),
        param: "state",
      },
      {
        question: "Di bandar manakah anda?",
        options: state ? CITIES[state] : [],
        param: "city",
      },
      {
        question: "Apakah jenis rawatan yang anda perlukan?",
        options: TREATMENT_TYPES,
        param: "treatment",
      },
      {
        question: "Adakah anda menghidap Hepatitis?",
        options: HEPATITIS_OPTIONS,
        param: "hepatitis",
      },
      {
        question: "Pilih sektor yang anda mahukan:",
        options: SECTOR,
        param: "sector",
      },
    ],
    [state]
  );

  // Determine if all required params are set
  const isComplete = useMemo(() => {
    if (!stateParam || !treatmentParam || !hepatitisParam || !sectorParam)
      return false;

    const formattedState = getFormattedValue(stateParam);
    const citiesForState = formattedState ? CITIES[formattedState] || [] : [];

    return citiesForState.length === 0 || cityParam;
  }, [stateParam, cityParam, treatmentParam, hepatitisParam, sectorParam]);

  // Update showResults when all params are complete
  useEffect(() => {
    if (isComplete) {
      setShowResults(true);
    }
  }, [isComplete]);

  const determineCurrentStep = () => {
    if (!stateParam) return 0;

    const formattedState = getFormattedValue(stateParam);
    const citiesForState = formattedState ? CITIES[formattedState] || [] : [];

    if (citiesForState.length === 0) {
      if (!treatmentParam) return 2;
      if (!hepatitisParam) return 3;
      if (!sectorParam) return 4;
      return 4;
    }

    if (!cityParam) return 1;
    if (!treatmentParam) return 2;
    if (!hepatitisParam) return 3;
    if (!sectorParam) return 4;
    return 4;
  };

  // Add currentStep as query state
  const [currentStepParam, setCurrentStepParam] = useQueryState("step", {
    shallow: false,
    parse: (value) => (value ? parseInt(value) : 0),
    serialize: (value) => value.toString(),
  });

  // Remove currentStep useState and use the query param value
  const currentStep = currentStepParam ?? determineCurrentStep();

  const handleOptionSelect = async (value: string) => {
    switch (currentStep) {
      case 0:
        await setStateParam(value.toLowerCase());
        const selectedState = getFormattedValue(value);
        const citiesForState = selectedState ? CITIES[selectedState] || [] : [];

        // If no cities available, clear city param and skip to treatment step
        if (citiesForState.length === 0) {
          await setCityParam(null);
          await setCurrentStepParam(2); // Update to use setCurrentStepParam
        } else {
          await setCurrentStepParam(1); // Update to use setCurrentStepParam
        }
        break;

      case 1:
        await setCityParam(value.toLowerCase());
        break;
      case 2:
        await setTreatmentParam(value.toLowerCase());
        break;
      case 3:
        await setHepatitisParam(value.toLowerCase());
        break;
      case 4:
        await setSectorParam(value.toUpperCase());
        setShowResults(true);
        break;
    }

    if (currentStep < steps.length - 1 && currentStep !== 0) {
      await setCurrentStepParam(currentStep + 1); // Update to use setCurrentStepParam
    }
  };

  const resetQuiz = async () => {
    await setStateParam(null);
    await setCityParam(null);
    await setTreatmentParam(null);
    await setHepatitisParam(null);
    await setSectorParam(null);
    await setCurrentStepParam(null); // Update to use setCurrentStepParam
    setShowResults(false);
  };

  const handleBack = async () => {
    if (currentStep > 0) {
      // Clear the parameter for the current step
      switch (currentStep) {
        case 1:
          await setStateParam(null);
          break;
        case 2:
          await setCityParam(null);
          break;
        case 3:
          await setTreatmentParam(null);
          break;
        case 4:
          await setHepatitisParam(null);
          break;
      }
      await setCurrentStepParam(currentStep - 1); // Update to use setCurrentStepParam
    }
  };

  const handleLocation = async () => {
    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      // Get location details from Mapbox
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=place,region`
      );

      const data = await response.json();

      // Find the state and city from the features
      const place = data.features.find((f: any) => f.place_type[0] === "place");
      const region = data.features.find(
        (f: any) => f.place_type[0] === "region"
      );

      if (region) {
        const state = region.text;
        // First set the state
        await setStateParam(state.toLowerCase());

        // If we found a city/town, set it after a small delay to allow state param to update
        if (place) {
          const city = place.text;
          setTimeout(async () => {
            await setCityParam(city.toLowerCase());
            await setCurrentStepParam(2); // Update to use setCurrentStepParam
          }, 100);
        } else {
          await setCurrentStepParam(1); // Update to use setCurrentStepParam
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 pt-4 pb-24">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md mx-auto"
          >
            <div className="mb-6">
              <div className="h-2 w-full bg-zinc-200 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-zinc-500">
                  Langkah {currentStep + 1} dari {steps.length}
                </p>
                <div className="flex flex-row gap-2 flex-wrap">
                  {stateParam && (
                    <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                      {getFormattedValue(stateParam)}
                    </Badge>
                  )}
                  {cityParam && (
                    <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                      {getFormattedValue(cityParam)}
                    </Badge>
                  )}
                  {treatmentParam && (
                    <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                      {getFormattedValue(treatmentParam)}
                    </Badge>
                  )}
                  {hepatitisParam && (
                    <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                      {getFormattedValue(hepatitisParam)}
                    </Badge>
                  )}
                  {sectorParam && (
                    <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                      {getFormattedValue(sectorParam) === "MOH"
                        ? "Kerajaan"
                        : getFormattedValue(sectorParam) === "PRIVATE"
                        ? "Swasta"
                        : getFormattedValue(sectorParam)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBack}
                  className="shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-2xl font-bold">
                {steps[currentStep].question}
              </h2>
            </div>
            <div className="space-y-3">
              {currentStep === 0 && (
                <Button
                  variant="outline"
                  className="w-full justify-between text-left h-auto py-4 px-6 shadow-md"
                  onClick={handleLocation}
                  disabled={isLocating}
                >
                  <span className="flex items-center gap-2">
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PopiconsPinDuotone className="h-4 w-4 text-primary" />
                    )}
                    {isLocating
                      ? "Mencari lokasi anda..."
                      : "Gunakan lokasi semasa"}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              {steps[currentStep]?.options?.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="w-full justify-between text-left h-auto py-4 px-6"
                  onClick={() => handleOptionSelect(option)}
                >
                  <span>
                    {option === "MOH"
                      ? "Kerajaan"
                      : option === "Private"
                      ? "Swasta"
                      : option}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl md:text-2xl font-bold">
                  Pusat Dialisis Yang Sesuai
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetQuiz}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Mula Semula
                </Button>
              </div>
              <div className="flex flex-row gap-2 flex-wrap">
                {stateParam && (
                  <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                    {getFormattedValue(stateParam)}
                  </Badge>
                )}
                {cityParam && (
                  <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                    {getFormattedValue(cityParam)}
                  </Badge>
                )}
                {treatmentParam && (
                  <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                    {getFormattedValue(treatmentParam)}
                  </Badge>
                )}
                {hepatitisParam && (
                  <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                    {getFormattedValue(hepatitisParam)}
                  </Badge>
                )}
                {sectorParam && (
                  <Badge className="bg-primary-foreground text-white rounded-none font-semibold text-sm">
                    {getFormattedValue(sectorParam)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialData.centers.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <SearchX className="w-12 h-12 text-zinc-400" />
                  <h3 className="mt-4 text-lg font-semibold text-zinc-950">
                    Tiada Pusat Dialisis
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Maaf, tiada pusat dialisis yang memenuhi kriteria carian
                    anda.
                  </p>
                </div>
              ) : (
                initialData.centers.map((center: any) => (
                  <CenterCard key={center.id} {...center} showService={false} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
