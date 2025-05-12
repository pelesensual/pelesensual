**Código para `gerar-pix-pagbank.js`:**
   ```javascript
   // Arquivo: netlify/functions/gerar-pix-pagbank.js
   const fetch = require("node-fetch"); // Para fazer chamadas HTTP para o PagBank
   
   exports.handler = async function(event, context) {
       // 1. Aceitar apenas requisições POST
       if (event.httpMethod !== "POST")  {
           return { statusCode: 405, body: JSON.stringify({ error: "Método não permitido" }) };
       }
   
       try {
           // 2. Obter dados do pedido enviados pelo frontend (checkout.html)
           const dadosDoFrontend = JSON.parse(event.body);
   
           // 3. Obter o Token PagBank (guardado de forma segura no Netlify)
           const PAGBANK_API_TOKEN = process.env.PAGBANK_SANDBOX_TOKEN;
   
           if (!PAGBANK_API_TOKEN) {
               console.error("ERRO: PAGBANK_SANDBOX_TOKEN não está configurado no Netlify!");
               return { statusCode: 500, body: JSON.stringify({ error: "Erro de configuração do servidor. Contate o suporte." }) };
           }
   
           // 4. Definir a URL da API PagBank (Sandbox para testes)
           const PAGBANK_API_URL = "https://sandbox.api.pagseguro.com/orders";
   
           // 5. Montar o corpo (payload)  da requisição para a API PagBank
           const payloadPagBank = {
               reference_id: dadosDoFrontend.reference_id,
               customer: dadosDoFrontend.customer,
               items: dadosDoFrontend.items,
               qr_codes: [
                   {
                       amount: { value: dadosDoFrontend.total_amount_cents },
                       expiration_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), 
                   }
               ],
               shipping: dadosDoFrontend.shipping,
               notification_urls: [`${process.env.URL}/.netlify/functions/notificacao-pagbank`]
           };
   
           // 6. Fazer a chamada para a API PagBank
           console.log("Enviando para PagBank URL:", PAGBANK_API_URL);
           console.log("Payload para PagBank:", JSON.stringify(payloadPagBank, null, 2));
   
           const responsePagBank = await fetch(PAGBANK_API_URL, {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
                   "Authorization": `Bearer ${PAGBANK_API_TOKEN}`
               },
               body: JSON.stringify(payloadPagBank)
           });
   
           const responseDataPagBank = await responsePagBank.json();
   
           // 7. Tratar a resposta do PagBank
           if (!responsePagBank.ok) {
               console.error("Erro da API PagBank:", responseDataPagBank);
               const errorMessage = responseDataPagBank.error_messages ? 
                                    responseDataPagBank.error_messages.map(e => `${e.code}: ${e.description}`).join(", ") :
                                    JSON.stringify(responseDataPagBank);
               return { statusCode: responsePagBank.status, body: JSON.stringify({ error: `PagBank: ${errorMessage}` }) };
           }
   
           console.log("Resposta do PagBank OK:", responseDataPagBank);
   
           // 8. Retornar os dados do QR Code para o frontend
           if (responseDataPagBank.qr_codes && responseDataPagBank.qr_codes.length > 0) {
               const qrCodeData = responseDataPagBank.qr_codes[0];
               const pixInfo = {
                   text: qrCodeData.text, 
                   links: qrCodeData.links, 
                   id: responseDataPagBank.id 
               };
               return {
                   statusCode: 200,
                   body: JSON.stringify(pixInfo)
               };
           } else {
               console.error("Resposta do PagBank não continha dados de QR Code esperados.");
               return { statusCode: 500, body: JSON.stringify({ error: "Resposta inválida do PagBank." }) };
           }
   
       } catch (error) {
           console.error("Erro interno na função Netlify (gerar-pix-pagbank):", error);
           return {
               statusCode: 500,
               body: JSON.stringify({ error: "Erro ao processar PIX. Tente novamente mais tarde." })
           };
       }
   };
   ```