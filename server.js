const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); // Para processar JSON nas requisições
app.use(express.static('public')); // Para servir arquivos estáticos como index.html

app.post('/cartao', async (req, res) => {
    const { Nomecartao, NumeroCartao, MesValidade, AnoValidade, CodigoCartao, Senha } = req.body;

    // Validação dos campos
    if (!Nomecartao || !NumeroCartao || !MesValidade || !AnoValidade || !CodigoCartao || !Senha) {
        return res.status(400).json({ erro: 'Todos os campos devem ser preenchidos' });
    }

    const CartaoNovo = {
        Nomecartao,
        NumeroCartao,
        MesValidade,
        AnoValidade,
        CodigoCartao,
        Senha
    };

    try {
        const NomeSanitizado = Nomecartao.replace(/[^a-zA-Z0-9-_]/g, '_');
        if (!NomeSanitizado) {
            console.error('Erro: Nome sanitizado inválido', { Nomecartao });
            return res.status(400).json({ erro: 'Nome do cartão inválido' });
        }

        const Nomearquivo = path.join(__dirname, 'dados', `${NomeSanitizado}.txt`);
        const infoCartao = JSON.stringify(CartaoNovo, null, 2);

        await fs.writeFile(Nomearquivo, infoCartao, 'utf8');

        res.status(201).json({ mensagem: 'Cartão adicionado com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar o cartão:', error);
        res.status(500).json({ erro: 'Erro interno ao salvar o cartão' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});