// src/mail.tsx
import { Detail, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";

async function getStoredToken(): Promise<string | null> {
  const token = await LocalStorage.getItem<string>("hackclub_api_token");
  return token || null;
}

type MailItem = {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  tracking_number?: string | null;
  tracking_link?: string | null;
};

type HackClubMailData = {
  mail: MailItem[];
};

export default function MailCommand() {
  const [mailData, setMailData] = useState<HackClubMailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getStoredToken();

        if (!token) {
          setError("No token configured. Please run the 'setkey' command first.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://mail.hackclub.com/api/public/v1/mail", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = (await response.json()) as HackClubMailData;
        setMailData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatMailItems = (items: MailItem[]) => {
    return items
      .map((item) => {
        const createdDate = new Date(item.created_at).toLocaleDateString("en-US");
        const tags = item.tags ? item.tags.join(", ") : "No tags";

        return `## ${item.title}
**Status:** ${item.status}  
**Type:** ${item.type}  
**ID:** ${item.id}  
**Created on:** ${createdDate}  
**Tags:** ${tags}  
${item.tracking_number ? `**Tracking number:** ${item.tracking_number}` : ""}
${item.tracking_link ? `**Tracking link:** ${item.tracking_link}` : ""}

---`;
      })
      .join("\n\n");
  };

  if (loading) {
    return <Detail markdown="Loading..." />;
  }

  if (error) {
    return <Detail markdown={`# Error\n\n${error}`} />;
  }

  if (!mailData) {
    return <Detail markdown="No data found." />;
  }

  return (
    <Detail
      markdown={`# Hack Club Mail

${mailData.mail.length} item(s) found.

${formatMailItems(mailData.mail)}`}
    />
  );
}
