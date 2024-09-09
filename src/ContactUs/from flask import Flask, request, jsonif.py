from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

ACCESS_TOKEN = 'EAAGZCJwDqMnwBO3oQ7UHU5025kS2cxTPQZAUnQhyvAktZAtZBJywWR1A2qPffG64SzE2deRZAykoByD51dHD4898h7uztkZC3ZAFtiFoPFkqTQxSGnrVfSBRSfoEM2fDwCrjztOWSCC14ftLfMEP9TmwBUkPdIjCtKv392IvVMrOXVeZADVTQBe2T27GIZCPIL7ZBjQHHhyEeQ0wmdqwtXmtUZD'
PHONE_NUMBER_ID = '393566413836995' 

@app.route('/send-whatsapp-message', methods=['POST'])
def send_whatsapp_message():
    data = request.get_json()
    phone_numbers = data.get('to')
    template_name = data.get('template_name', 'hello_world')
    language_code = data.get('language_code', 'en_US')

    url = f'https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages'
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }

    results = []
    
    for recipient_number in phone_numbers:
        payload = {
            'messaging_product': 'whatsapp',
            'to': recipient_number,
            'type': 'template',
            'template': {
                'name': template_name,
                'language': {
                    'code': language_code
                }
            }
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            results.append({'number': recipient_number, 'status': 'success', 'response': response.json()})
        except requests.exceptions.RequestException as e:
            results.append({'number': recipient_number, 'status': 'error', 'message': str(e)})

    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
