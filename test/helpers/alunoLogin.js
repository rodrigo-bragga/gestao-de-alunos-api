import { api } from './api.js';

let tokenEmCache = null

export async function getTokenAluno() {
    if (!tokenEmCache) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                    email: "joao.silva@escola.com", 
                    senha: "aluno123"
            });
        
        tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;
}