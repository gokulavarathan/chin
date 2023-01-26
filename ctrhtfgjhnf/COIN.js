const express = require('express');
const mongoose = require('mongoose');
const request = require('request')

exports.coinController = async (req, res) => {
    console.log("-------------------> ~ req.body", req.body)

    const data = req.body;

    // EOS Withdraw
    if (data.currency == 'EOS') {

        const { Api, JsonRpc, RpcError } = require('eosjs')
        const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
        const fetch = require('node-fetch');
        const { TextEncoder1, TextDecoder1 } = require('util');
        const { TextEncoder, TextDecoder } = require('text-encoding');

        const totalamount = req.body.amount;
        const memo = req.body.memo;
        // const eos_link = 'http://127.0.0.1:8888';
        const eos_link = 'https://jungle3.cryptolions.io';
        // const eos_address = 'EOS75TwXoEr64gKrax3HC57mGPcLvfkcaVT6fEn8hg1KRXycdQ5NV';
        // const crypto_address2 = 'EOS5Wod6jNnSVk15UrdHJycJJnVnTczVEJGd2BWTf6tCQnYJExYnU';

        const eos_address = 'muzitester12';
        const crypto_address2 = req.body.toAddress;

        const defaultPrivateKey = "5KPTtHe2aMFs7EKgdGSWSRLugJZwfw4ULQDHyGv7gci9zC3C7VG"
        const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
        console.log("-------------------> ~ signatureProvider", signatureProvider)
        const rpc = new JsonRpc('https://jungle3.cryptolions.io', { fetch })
        // const rpc = new JsonRpc(eos_link, { fetch });
        console.log("-------------------> ~ rpc", rpc)

        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        // console.log("-------------------> ~ api", api)
        try {
            (async () => {
                const result = await api.transact({
                    actions: [{
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: eos_address,
                            permission: 'active',
                        }],
                        data: {
                            from: eos_address,
                            to: crypto_address2,
                            /*to: "junglefaucet",testnet*/
                            quantity: totalamount.toFixed(4) + ' EOS',
                            // quantity: '10.0000 EOS',
                            memo: memo,
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                console.log("-------------------> ~ result", result)
                if (result.transaction_id != "") {
                    transaction_id = result.transaction_id.toString();
                    res.json({ status: true, Message: ' Transaction completed successfully', transaction_id: transaction_id });

                }
                else {
                    console.log(' EOS Transaction falied.Please try again', result)

                }
            })();
        }
        catch (e) {
            console.log('\nCaught exception: ' + e);
            if (e instanceof RpcError)
                console.log(JSON.stringify(e.json, null, 2));
        }
    }
    else if (data.currency == 'FLOW') {
        const sdk = require("@onflow/sdk");
        // Building an Execute Script Interaction
        const interaction = await sdk.build([
            sdk.script`
                pub fun main(): Int {
                    return 721
                }
            `
        ])
        console.log("-------------------> ~ interaction", interaction)
        // Building an Execute Get Account Interaction
        const interaction2 = await sdk.build([
            sdk.getAccount("123ABC456DEF")

        ])
        console.log("-------------------> ~ interaction2", interaction2)


        const signingFunction = async () => {

            return signature
        }

        //Building a Transaction Interaction
        const interaction3 = await sdk.build([
            sdk.transaction`transaction() { prepare(acct: AuthAccount) {} execute { log("Hello, Flow!") } }`,
            sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
            sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
            sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
        ])
        console.log("-------------------> ~ interaction3", interaction3)



        //Building an Execute Script Interaction

        const types = require("@onflow/types");


        const builtInteraction = await sdk.build([
            sdk.script`
                pub fun main(msg: String): String {
                    return "Hello, Flow!"
                }
            `,
            sdk.args([sdk.arg("Hello, Flow", types.String)])
        ])
        console.log("-------------------> ~ builtInteraction", builtInteraction)

        const resolvedInteraction = await sdk.pipe(builtInteraction, [
            sdk.resolveParams,
            sdk.resolveArguments,
        ])
        console.log("-------------------> ~ resolvedInteraction", resolvedInteraction)

        const response = await sdk.send(resolvedInteraction, { node: "access.devnet.nodes.onflow.org:9000" })
    }
    else if (data.currency == "tezos") {
        var Sotez = require('sotez').Sotez;
        const tezos = new Sotez('https://testnet-tezos.giganode.io/', 'main', {
            defaultFee: 1420,
            localForge: true,
            validateLocalForge: false,
            debugMode: false,
            useMutez: true,
        });
        const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default;
        console.log(tezos, "=============tezos")

        const balance = await tezos.getBalance('tz1e148HC7RUtCcZRNb4UnjNoRjyyxB8pNps');
        console.log(balance, "----------------balance")



        // await tezos.importLedger(TransportNodeHid, "44'/1729'/0'/0'");
        const delegate = async () => {
            await tezos.importKey(
                'edsk3Z2t7t1XimympW62RmUDQeBxn9dw3pQdxxhpAGngmkjiFuXUAj',
            );
            const { hash } = await tezos.setDelegate({
                delegate: 'tz1e148HC7RUtCcZRNb4UnjNoRjyyxB8pNps',
            });

            console.log(`Waiting for operation ${hash}`);
            const blockHash = await tezos.awaitOperation(hash);
            console.log(`Operation found in block ${blockHash}`);
        };

        delegate();


        // const conseiljs = require('conseiljs');
        // const conseiljssoftsigner = require('conseiljs-softsigner');
        // const tezosNode = 'd32b2d08-1113-4e07-8ff4-30f1e394326f'; // get access as https://nautilus.cloud
        // const keystore = {
        //   publicKey: 'edpkvQtuhdZQmjdjVfaY9Kf4hHfrRJYugaJErkCGvV3ER1S7XWsrrj',
        //   secretKey: 'edskRgu8wHxjwayvnmpLDDijzD3VZDoAH7ZLqJWuG4zg7LbxmSWZWhtkSyM5Uby41rGfsBGk4iPKWHSDniFyCRv3j7YFCknyHH',
        //   publicKeyHash: 'tz1QSHaKpTFhgHLbqinyYRjxD5sLcbfbzhxy',
        //   seed: '',
        //   storeType: conseiljs.KeyStoreType.Fundraiser
        // };

        // const signer = await conseiljssoftsigner.SoftSigner.createSigner(conseiljs.TezosMessageUtils.writeKeyWithHint(keystore.secretKey, 'edsk'));
        // const result = await conseiljs.TezosNodeWriter.sendIdentityActivationOperation(tezosNode, keystore, '0a09075426ab2658814c1faf101f53e5209a62f5');
        // console.log(`Injected operation group id ${result.operationGroupID}`)

    }
    else if (data.currency == "TEZOS") {

        try {

            const fetch = require('node-fetch');
            const log = require('loglevel');

            const { registerFetch, registerLogger, Signer, TezosMessageUtils } = require('conseiljs');
            const { KeyStoreUtils, SoftSigner } = require('conseiljs-softsigner');

            const logger = log.getLogger('conseiljs');
            console.log("-------------------> ~ logger", logger)
            logger.setLevel('debug', false); // to see only errors, set to 'error'
            registerLogger(logger);
            registerFetch(fetch);

            let signer = Signer;
            const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey('edskRgu8wHxjwayvnmpLDDijzD3VZDoAH7ZLqJWuG4zg7LbxmSWZWhtkSyM5Uby41rGfsBGk4iPKWHSDniFyCRv3j7YFCknyHH');
            console.log("-------------------> ~ keyStore", keyStore)
            signer = await SoftSigner.createSigner(TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'), -1);
            console.log("-------------------> ~ signer", signer)








        } catch (e) {
            console.log(e);
        }









    }

}
