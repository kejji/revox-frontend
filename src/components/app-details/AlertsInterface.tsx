import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Plus } from "lucide-react";

export interface AlertConfig {
  id: string;
  type: "keywords" | "rating_below" | "overall_rating";
  name: string;
  config: {
    keywords?: string[];
    ratingThreshold?: number;
    overallRatingMin?: number;
    overallRatingMax?: number;
  };
  active: boolean;
}

interface AlertsInterfaceProps {
  alerts?: AlertConfig[];
  onAlertsChange?: (alerts: AlertConfig[]) => void;
}

export function AlertsInterface({ alerts = [], onAlertsChange }: AlertsInterfaceProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [newAlert, setNewAlert] = useState<Partial<AlertConfig>>({
    type: "keywords",
    name: "",
    config: {},
    active: true,
  });

  const handleCreateAlert = () => {
    if (!newAlert.name) return;

    const alert: AlertConfig = {
      id: Date.now().toString(),
      type: newAlert.type!,
      name: newAlert.name,
      config: newAlert.config!,
      active: newAlert.active!,
    };

    const updatedAlerts = [...alerts, alert];
    onAlertsChange?.(updatedAlerts);
    
    // Reset form
    setNewAlert({
      type: "keywords",
      name: "",
      config: {},
      active: true,
    });
    setActiveTab("view");
  };

  const handleDeleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    onAlertsChange?.(updatedAlerts);
  };

  const handleToggleAlert = (id: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    );
    onAlertsChange?.(updatedAlerts);
  };

  const renderAlertConfig = (alert: AlertConfig) => {
    switch (alert.type) {
      case "keywords":
        return `Keywords: ${alert.config.keywords?.join(", ") || "None"}`;
      case "rating_below":
        return `Rating below: ${alert.config.ratingThreshold || "N/A"}`;
      case "overall_rating":
        return `Overall rating: ${alert.config.overallRatingMin || "N/A"} - ${alert.config.overallRatingMax || "N/A"}`;
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="h-4 w-4" />
          {alerts.filter(a => a.active).length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold leading-none">
                {alerts.filter(a => a.active).length}
              </span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Alert Configuration</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">Current Alerts</TabsTrigger>
            <TabsTrigger value="create">Create Alert</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No alerts configured</p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("create")}
                  className="mt-3"
                >
                  Create your first alert
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{alert.name}</h4>
                        <Badge variant={alert.active ? "default" : "secondary"}>
                          {alert.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {renderAlertConfig(alert)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAlert(alert.id)}
                      >
                        {alert.active ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="alert-name">Alert Name</Label>
                <Input
                  id="alert-name"
                  placeholder="Enter alert name"
                  value={newAlert.name || ""}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="alert-type">Alert Type</Label>
                <Select 
                  value={newAlert.type} 
                  onValueChange={(value: AlertConfig["type"]) => 
                    setNewAlert(prev => ({ ...prev, type: value, config: {} }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keywords">Comments containing keywords</SelectItem>
                    <SelectItem value="rating_below">Comments with rating below X</SelectItem>
                    <SelectItem value="overall_rating">Overall rating changes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newAlert.type === "keywords" && (
                <div>
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="crash, bug, slow"
                    onChange={(e) => setNewAlert(prev => ({
                      ...prev,
                      config: { 
                        ...prev.config, 
                        keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                      }
                    }))}
                  />
                </div>
              )}
              
              {newAlert.type === "rating_below" && (
                <div>
                  <Label htmlFor="rating-threshold">Rating Threshold</Label>
                  <Select 
                    onValueChange={(value) => setNewAlert(prev => ({
                      ...prev,
                      config: { ...prev.config, ratingThreshold: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 star</SelectItem>
                      <SelectItem value="2">2 stars</SelectItem>
                      <SelectItem value="3">3 stars</SelectItem>
                      <SelectItem value="4">4 stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {newAlert.type === "overall_rating" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-rating">Minimum Rating</Label>
                    <Input
                      id="min-rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="3.0"
                      onChange={(e) => setNewAlert(prev => ({
                        ...prev,
                        config: { 
                          ...prev.config, 
                          overallRatingMin: parseFloat(e.target.value) || undefined
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-rating">Maximum Rating</Label>
                    <Input
                      id="max-rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="5.0"
                      onChange={(e) => setNewAlert(prev => ({
                        ...prev,
                        config: { 
                          ...prev.config, 
                          overallRatingMax: parseFloat(e.target.value) || undefined
                        }
                      }))}
                    />
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleCreateAlert}
                disabled={!newAlert.name}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}