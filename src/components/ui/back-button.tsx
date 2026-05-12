import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/router-compat";

export const BackButton = ({ fallbackTo = "/", label = "Назад" }: { fallbackTo?: string; label?: string }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackTo);
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleBack}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};