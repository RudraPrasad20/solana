import "dotenv/config";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  airdropIfRequired,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";

async function main() {
  // to generate a new keypair
  // const keypair = Keypair.generate()

  // to read the secret key from .env using getKeypairFromEnvironment from "@solana-developers/helpers"
  const keypair = getKeypairFromEnvironment("SECRET_KEY");
  console.log(keypair.publicKey.toBase58());
  console.log(keypair.secretKey);

  // connecting to devnet
  // const connection = new Connection(clusterApiUrl("devnet"))
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  // getting the publickey
  const address = new PublicKey(keypair.publicKey.toBase58());

  // fetching balance
  const balanace = await connection.getBalance(address);
  console.log("balance is :", balanace / LAMPORTS_PER_SOL);

  // TRANSACTIONS:
  // create new constructor
  const transaction = new Transaction();
  // reciver address
  const recive = new PublicKey("2DVaHtcdTf7cm18Zm9VV8rKK4oSnjmTkKE6MiXe18Qsb");

  // details
  const sendSol = SystemProgram.transfer({
    fromPubkey: address,
    toPubkey: recive,
    lamports: LAMPORTS_PER_SOL * 0.01,
  });
  // call
  transaction.add(sendSol);
  // every transaction have a unique signature
  // connection: "devnet" | "mainnet"
  // transaction: new Transaction() - sendSol
  // keypair: from .env - [39,393,39...]
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    keypair,
  ]);
  console.log("Transaction signature:", signature); // print the signature

  // airdrop if needed
  const requstAirdrop = airdropIfRequired(
    connection,
    address,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
  );
}
main();
