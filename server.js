//Paciência e uma boa prova. Que a Força esteja com você!
import {createServer} from 'node:http'
import {readFile , writeFile} from 'node:fs'

const PORT = 3333;

const lerDadosLivro = (callback) => {
    readFile('livros.json', 'utf-8', (err, data) => {
        if (err) {
            callback(err)
        } else {
            try {
                const livros = JSON.parse(data)
                callback(null, livros)
            } catch (err) {
                callback(err)
            }
        }
    })
}



const server = createServer((request, response)=>{
    const {method ,url } = request 

    if(url === '/livro' && method === 'GET'){
        console.log(method, url)

        //ler os dados vindo do pessoa.json
        lerDadosLivro((err, livros) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Erro no servidor' }))
                } else {
                    response.writeHead(200, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify(livros))
                }
        })
    }else if(url === '/livro' && method === 'POST'){
        // cadastra pessoa
        let body = ''
        request.on('data', (chunk) => {
            body += chunk
        })
        request.on('end', () => {
            if (!body) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: 'Corpo da solicitação vazio' }))
                return
            }
         

                const novaLivro = JSON.parse(body)
                //ler dados vindos do passoas.json
                lerDadosLivro((err, livros) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'Erro ao cadastrar pessoa' }))
                    }
                    novaLivro.id = livros.length + 1
                    livros.push(novaLivro)

                    // escrever arquivo no pessoas.json tipo json
                    writeFile('livros.json', JSON.stringify(livros, null, 2), (err) => {
                        if (err) {
                            response.writeHead(500, { 'Content-Type': 'application/json' })
                            response.end(JSON.stringify({ message: 'Erro ao cadastrar pessoa' }))
                            return
                        }
                        response.writeHead(201, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify(novaLivro))
                    })
                })
           
        })
    }else if( method ==='GET' && url.startsWith('/livro/')){

        //  console.log(method,url)

   
        const livroId = url.split('/')[2]
        console.log(`id: ${livroId}`) //tudo certo
        
      
        lerDadosLivro((err, livros)=>{
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro no servidor'}))
            } 
          
                const livroFind = livros.find((livro)=>livro.id == livroId)
                console.log(livros)

                if(!livroFind){
                    response.writeHead(404,{'Content-Type':'application/json'})
                    response.end(JSON.stringify({ message: 'Pessoa não encontrada' }))
            
                } else{
                    response.writeHead(200,{'Content-Type':'application/json'})
                    response.end(JSON.stringify(livroFind))
                    return;
                }
            response.end()
            // console.log(pessoas)
        })

    }else if( method ==='GET' && url.startsWith('/autores')){

        //  console.log(method,url)

   
        const livroId = url.split('/')[2]
        console.log(`id: ${livroId}`) //tudo certo
        
      
        lerDadosLivro((err, livros)=>{
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro no servidor'}))
            } 
          
                const livroFind = livros.find((livro)=>livro.id == livroId)
                console.log(livros)

                if(!livroFind){
                    response.writeHead(404,{'Content-Type':'application/json'})
                    response.end(JSON.stringify({ message: 'Pessoa não encontrada' }))
            
                } else{
                    response.writeHead(200,{'Content-Type':'application/json'})
                    response.end(JSON.stringify(livroFind))
                    return;
                }
            response.end()
            // console.log(pessoas)
        })

    }else if(method === 'POST' && url.startsWith('/editoras')){
        const pessoaId = url.split('/')[3];
        const index = pessoas.findIndex((usuario) => usuario.id == pessoaId);
    
        if (index === -1) {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Pessoa não encontrada' }));
        } else {
            let body = '';
    
            request.on('data', (chunk) => {
                body += chunk;
            });
    
            request.on('end', () => {
                const phoneNumbers = JSON.parse(body);
    
                const NumerosValidacao = phoneNumbers.every((num) =>
                    Object.hasOwnProperty.call(num, 'tipo') &&
                    Object.hasOwnProperty.call(num, 'numero')
                );
    
                if (!NumerosValidacao) {
                    response.writeHead(400, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'Não foi possível criar um telefone' }));
                } else {
                    data[index] = {
                        ...data[index],
                        telefone: phoneNumbers,
                    };
    
                    writeFile('./pessoas.json', JSON.stringify(data, null, 2), (err) => {
                        if (err) {
                            response.writeHead(500, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ message: 'Erro ao cadastrar pessoa' }));
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ message: 'Telefone(s) adicionado(s) com sucesso!', usuario: data[index] }));
                        }
                    });
                }
            });
        }
    } else if(method === 'PUT' && url === '/editoras/'){
        editoraId = url.split('/')[3]

            let body = ''
            request.on("data", (chunk)=>{
              body += chunk
            })
            request.on('end',()=>{
      if(!body){
          response.writeHead(400,{'Content-Type':'application/json'})
          response.end(JSON.stringify({message:"Corpo da solicitação vazio"}))
         return
      }
       lerDadosLivro((err,livros)=>{
          if(err){
              response.writeHead(500,{'Content-Type':'application/json'})
              response.end(JSON.stringify({message:'Erro no servidor'}))
      
          }
      
          const indexEditora = livros.findIndex((livro)=>livro.id == id)
          if(indexEditora === -1){
              response.writeHead(404,{'Content-type':'application'})
              response.end(JSON.stringify({message:'Endereço não encontrada'}))
              return
          }
           const editoraAtualizada= JSON.parse(body)
           editoraAtualizada.id = id
           livros[indexEditora] = editoraAtualizada
       })
      
              writeFile("livros.json", JSON.stringify(livros, null, 2), (err)=>{
                  if(err){
                      response.writeHead(500,{'Content-Type':'application/json'})
                      response.end(JSON.stringify({message:"Erro interno no servidor"}))
                      return
                  }
              })
      
              response.writeHead(201,{'Content-Type':'application/json'})
              response.end(JSON.stringify(editoraAtualizada))
            })

    const id = parseInt(url.split('/')[2])
    lerDadosPessoas((err,pessoas)=>{
        if(err){
            response.writeHead(500,{'Content-Type':'application/json'})
                response.end(JSON.stringify({message:"Erro interno no servidor"}))
                return
        }
        const indexPessoa = pessoas.findIndex((pessoa)=>pessoa.id == id)
        if(indexPessoa === -1){
        response.writeHead(404,{'Content-type':'application'})
        response.end(JSON.stringify({message:'Pessoa não encontrada'}))
         return    
    }

    pessoas.splice(indexPessoa,1)
    writeFile('pessoas.json',JSON.stringify(pessoas, null, 2),(err)=>{
        if(err){
            response.writeHead(500,{'Content-type':'application'})
        response.end(JSON.stringify({message:'Error ao deletar pessoa'}))
        return
        }
        response.writeHead(200,{"Content-Type":"application/json"})
        response.end(JSON.stringify({message:"Pessoa deletada"}))
    })
    })
 }else if(method === 'DELETE' && url.startsWith('/editoras')){
    const ideditora = url.split('/')[3]
    lerDadosLivro((err, livro)=>{
        if(err){
            response.writeHead(500, {'Content-Type':'application/json'})
            response.end(JSON.stringify({ message:'erro interno no servidor'}))
            return;
        }

        const indexEditora = livros.findIndex((livro)=>livro.id == ideditora)
        if(indexEditora=== -1){
            response.writeHead(404, {'Content-type':'application/json'})
            response.end(JSON.stringify({message:'pessoa nao encontrada'}))
            return
        }
        writeFile('livros.json',JSON.stringify(livros, null, 2), (err)=>{
            if(err){
                response.writeHead(500, {'Content-type':'application/json'})
                response.end(JSON.stringify({message:'erro ao atualizar'}))
                return
            }
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'Telefone removido com sucesso' }))
        })
    })
 } else{
        response.writeHead(404, {'Content-Type':'application/json'})
        response.end(JSON.stringify({message: 'Rota não encontrada'}))
    }

})

server.listen(PORT, ()=>{
    console.log(`servidor on PORT ${PORT}`)
})
