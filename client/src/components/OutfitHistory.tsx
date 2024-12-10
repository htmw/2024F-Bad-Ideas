import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getOutfitHistory } from "@/lib/firebase/outfitHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, ThermometerSun } from "lucide-react";
import { format } from "date-fns";

export default function OutfitHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      try {
        const outfits = await getOutfitHistory(user.uid);
        setHistory(outfits);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  if (loading) {
    return <div>Loading history...</div>;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to view your outfit history
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Your Outfit History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No outfit history yet. Your recommended outfits will appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "PPP")}
                    </span>
                    <div className="flex items-center gap-1">
                      <ThermometerSun className="h-4 w-4" />
                      <span className="text-sm">
                        {entry.weather.temperature}°F
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {entry.outfit.baseLayers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium">Base Layer</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.outfit.baseLayers
                            .map((item) => item.name)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                    {entry.outfit.midLayers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium">Mid Layer</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.outfit.midLayers
                            .map((item) => item.name)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                    {entry.outfit.outerLayers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium">Outer Layer</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.outfit.outerLayers
                            .map((item) => item.name)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
