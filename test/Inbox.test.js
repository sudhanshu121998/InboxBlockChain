const assert= require('assert');
const ganache=require('ganache-cli');
const { describe } = require('mocha');
const {interface,bytecode}= require('/home/sudhanshu/Desktop/inbox/compile.js')
//constructor of web3 library
const Web3=require('web3');
//instace of Web3
//ganache.provider can be replaced with specific network provider we want to connect
const web3 = new Web3(ganache.provider());
let accounts;
let inbox;
const INTIAL_STRING='HI THERE'
beforeEach(async()=>{
    //Get list of all accounts
    accounts=await web3.eth.getAccounts()

    //Creating object of Contract and passing interface to it
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data:bytecode,
            arguments:[INTIAL_STRING]
        })
        .send({
            from: accounts[0],
            gas:'1000000'
        })
});

describe('Inbox',()=>{
    it('deploys a contract',()=>{
        //Checking wheather contract got the address 
        assert.ok(inbox.options.address);
    });

    it('has a default msg',async ()=>{
        //await contractname.property(methods).functionToBe 
        //called(we can pass arguments to function).call is calling fnc
        const message= await inbox.methods.message().call();
        assert.equal(message,INTIAL_STRING);
    });

    it('Can change message',async ()=>{
        //this will return hash and many other information 
        await inbox.methods.setMessage('bye').send({
            from: accounts[0]
        });
        const message= await inbox.methods.message().call();
        assert.equal(message,'bye');
        
    });
});