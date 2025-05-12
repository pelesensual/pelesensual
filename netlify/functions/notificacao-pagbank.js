 **Código para `notificacao-pagbank.js`:**
   ```javascript
   // Arquivo: netlify/functions/notificacao-pagbank.js
   exports.handler = async function(event, context) {
       // 1. Aceitar apenas requisições POST (o PagBank envia notificações via POST)
       if (event.httpMethod !== "POST")  {
           return { statusCode: 405, body: JSON.stringify({ error: "Método não permitido" }) };
       }
   
       try {
           const notificacaoData = JSON.parse(event.body);
           console.log("----- NOTIFICAÇÃO PAGBANK RECEBIDA -----");
           console.log(JSON.stringify(notificacaoData, null, 2));
   
           // TODO IMPORTANTE: Validação da Notificação (Consulte a documentação do PagBank)
           // Ex: const signature = event.headers["x-pagbank-signature"];
           // if (!isValidSignature(signature, event.body)) {
           //     console.warn("Assinatura de webhook inválida!");
           //     return { statusCode: 401, body: "Assinatura inválida" };
           // }
   
           // TODO: Processar a Notificação
           // const pedidoId = notificacaoData.reference_id;
           // const statusPagamento = notificacaoData.charges[0].status; // Ex: "PAID"
           // if (statusPagamento === "PAID") { ... }
   
           return { statusCode: 200, body: JSON.stringify({ message: "Notificação recebida" }) };
   
       } catch (error) {
           console.error("Erro ao processar notificação PagBank:", error);
           return { statusCode: 500, body: JSON.stringify({ error: "Erro ao processar notificação" }) };
       }
   };
   ```