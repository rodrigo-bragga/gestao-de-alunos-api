import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';
import { getTokenAdmin } from './helpers/adminLogin.js';
import { getTokenAluno } from './helpers/alunoLogin.js';
import  dados from './fixtures/dados.json' with { type: 'json' };

describe('Teste E2E de cadastrar de aluno, logar como aluno e registrar a entrega de um trabalho como aluno', () => {
    dados.forEach((dados)=>{
        it.only(dados.testTitle, async () => {
            // Logando como Adminstrador e pegando token para cadastrar aluno
            const tokenAdmin = await getTokenAdmin();
            
            // Cadastrando aluno com o Administrador recem logado
            const alunoCadastroResposta = await request(app)
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(dados.dadosAluno);
                
            // Cadastra aluno recem criado na disciplina
            const disciplinaCadastroResposta = await request(app)
                .post(`/api/admin/disciplinas/${dados.dadosEntregaTrabalho.disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send({ alunoId: alunoCadastroResposta.body.id });

            // Logando como aluno e pegando token para registrar entrega de trabalho
            const tokenAluno = await getTokenAluno();

            // Registrando entrega de trabalho como aluno
            const entregaTrabalhoResposta = await request(app)
                .post(`/api/alunos/${alunoCadastroResposta.body.id}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAluno)
                .send(dados.dadosEntregaTrabalho);

            // Faz as validações que o aluno conseguiu entregar o trabalho com sucesso
            expect(entregaTrabalhoResposta.status).to.equal(201);
            expect(entregaTrabalhoResposta.body.alunoId).to.equal(alunoCadastroResposta.body.id);
            expect(entregaTrabalhoResposta.body.disciplinaId).to.equal(dados.dadosEntregaTrabalho.disciplinaId);
            expect(entregaTrabalhoResposta.body.titulo).to.equal(dados.dadosEntregaTrabalho.titulo);
            expect(entregaTrabalhoResposta.body.descricao).to.equal(dados.dadosEntregaTrabalho.descricao);
            expect(entregaTrabalhoResposta.body.status).to.equal('entregue');
        });
    })
});