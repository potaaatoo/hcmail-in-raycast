// === src/commands/setkey.tsx ===
import { Form, ActionPanel, Action, showToast, Toast, LaunchProps } from "@raycast/api";
import { useState, useEffect } from "react";
import { LocalStorage } from "@raycast/api";

// Type pour les arguments de la commande
interface Arguments {
  token?: string;
}

export default function SetKeyCommand({ arguments: args }: LaunchProps<{ arguments: Arguments }>) {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Si un token est passé en argument (ex: "setkey klédapi")
    if (args.token) {
      setToken(args.token);
      handleSubmit(args.token);
    }
  }, [args.token]);

  async function handleSubmit(tokenToSave?: string) {
    const finalToken = tokenToSave || token;
    
    if (!finalToken.trim()) {
      showToast({ 
        style: Toast.Style.Failure, 
        title: "Token requis",
        message: "Veuillez entrer un token valide"
      });
      return;
    }

    try {
      await LocalStorage.setItem("hackclub_api_token", finalToken);
      showToast({ 
        style: Toast.Style.Success, 
        title: "Token sauvegardé",
        message: `Token "${finalToken}" enregistré avec succès`
      });
    } catch (error) {
      showToast({ 
        style: Toast.Style.Failure, 
        title: "Erreur",
        message: "Impossible de sauvegarder le token"
      });
    }
  }

  if (args.token) {
    return null; 
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm 
            title="Sauvegarder Token" 
            onSubmit={() => handleSubmit()}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="token"
        title="API Token"
        placeholder="Enter your HCmail token (ex: th_apk_live_1GBnLO98LHfoSa1cLRQMJFTTZvQ5xJ2cLUsm)"
        value={token}
        onChange={setToken}
      />
    </Form>
  );
}