export interface Message {
  id: string;
  sender: string;
  message: string;
  aiSummary: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "Customer Support",
    message: "Hi, I placed an order 5 days ago but haven't received it yet. Can you help?",
    aiSummary: "AI Summary: Customer is asking about order delivery status.",
  },
  {
    id: "2",
    sender: "Website Contact Form",
    message: "I'm interested in your enterprise plan. Could someone reach out to discuss pricing?",
    aiSummary: "AI Summary: Potential enterprise lead requesting a pricing consultation.",
  },
  {
    id: "3",
    sender: "WhatsApp Lead",
    message: "Hello! I saw your ad and would like to know more about your product.",
    aiSummary: "AI Summary: Inbound lead from ad campaign, seeking product information.",
  },
  {
    id: "4",
    sender: "Email Inquiry",
    message: "I'd like to request a refund for my last purchase. The item arrived damaged.",
    aiSummary: "AI Summary: Customer requesting a refund due to damaged goods on delivery.",
  },
  {
    id: "5",
    sender: "WhatsApp Lead",
    message: "Do you offer a free trial? I want to test the platform before committing.",
    aiSummary: "AI Summary: Prospect asking about trial availability before purchasing.",
  },
];

export function getMessages(): Promise<Message[]> {
  const delay = Math.floor(Math.random() * 500) + 500; // 500–1000ms
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MESSAGES), delay);
  });
}
