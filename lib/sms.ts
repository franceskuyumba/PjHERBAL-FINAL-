function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '255' + cleaned.substring(1);
  }
  return cleaned;
}

export async function sendSMS(phone: string, messageText: string) {
  const formattedPhone = formatPhoneNumber(phone);
  const payload = {
    messages: [
      {
        from: 'InfoSMS',
        destinations: [{ to: formattedPhone }],
        text: messageText
      }
    ]
  };

  try {
    const res = await fetch(`${process.env.INFOBIP_BASE_URL}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        'Authorization': process.env.INFOBIP_API_KEY || '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await res.json();
  } catch (error) {
    console.error('Infobip SMS dispatch error:', error);
    return null;
  }
}
