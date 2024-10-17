import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to WeatherWear
        </h1>
        <p className="text-lg text-center sm:text-left max-w-md">
          Your personal guide to dressing for any weather condition. Stay
          stylish and comfortable, no matter the forecast.
        </p>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Check the weather forecast for your location.
          </li>
          <li className="mb-2">Get personalized outfit recommendations.</li>
          <li>Stay comfortable and stylish all day long!</li>
        </ol>
      </main>
    </div>
  );
}
