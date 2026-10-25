export class SmartPasteButtonDemo {
  iconPosition = 'Left';
  isPrimary = true;
  disabled = false;
  created = 0;
  calls = 0;
  prompt = '';
  repeatClicks = 0;

  // stands in for a call to an AI service: answers in the format the control asks for
  handler = async (settings: { messages: { role: string; content: string }[] }) => {
    this.calls++;
    this.prompt = settings.messages[1].content.trim();
    return [
      'FIELD fullName^^^Jane Doe',
      'FIELD email^^^jane@example.com',
      'FIELD country^^^Canada',
      'FIELD subscribe^^^yes'
    ].join('\n');
  };
}
