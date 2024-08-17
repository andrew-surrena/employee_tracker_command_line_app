import { QueryResult } from 'pg';
import {pool, connectToDb} from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

const PORT = process.env.PORT;

//class Cli {

const variable : QueryResult = 
