import { Validator } from './index.js';

const userSchema = {
    email: { required: true, email: true },
    password: { required: true, password: true, min: 6 },
    name: { required: true, min: 3, max: 50 },
    age: { number: true },
    website: { url: true },
    role: { in: ['admin', 'user', 'guest'] },
    terms: { boolean: true, equals: true }
};

async function runTests() {
    console.log('='.repeat(60));
    console.log('PRUEBAS DE VALIDACIÓN - VALIDATOR');
    console.log('='.repeat(60));

    const validatorES = new Validator(userSchema, 'es');
    const validatorEN = new Validator(userSchema, 'en');
    const validatorPT = new Validator(userSchema, 'pt');
    const validatorFR = new Validator(userSchema, 'fr');

    console.log('\n TEST 1: Datos válidos (Español)');
    console.log('-'.repeat(60));
    const validRequest = {
        body: {
            email: 'usuario@ejemplo.com',
            password: 'Password123',
            name: 'Juan Pérez',
            age: '25',
            website: 'https://ejemplo.com',
            role: 'admin',
            terms: true
        }
    };
    const result1 = await validatorES.validate(validRequest);
    console.log(JSON.stringify(result1, null, 2));

    console.log('\n TEST 2: Datos inválidos (Español)');
    console.log('-'.repeat(60));
    const invalidRequest = {
        body: {
            email: 'correo-invalido',
            password: 'abc',
            name: 'AB',
            age: 'no-es-numero',
            website: 'no-es-url',
            role: 'superadmin',
            terms: false
        }
    };
    const result2 = await validatorES.validate(invalidRequest);
    console.log(JSON.stringify(result2, null, 2));

    console.log('\n🇬🇧 TEST 3: Campos vacíos (English)');
    console.log('-'.repeat(60));
    const emptyRequest = {
        body: {}
    };
    const result3 = await validatorEN.validate(emptyRequest);
    console.log(JSON.stringify(result3, null, 2));

    console.log('\n TEST 4: Email inválido (Português)');
    console.log('-'.repeat(60));
    const emailInvalidRequest = {
        body: {
            email: 'email@invalido',
            password: 'Senha123',
            name: 'Maria Silva',
            terms: true
        }
    };
    const result4 = await validatorPT.validate(emailInvalidRequest);
    console.log(JSON.stringify(result4, null, 2));

    console.log('\n TEST 5: Contraseña débil (Français)');
    console.log('-'.repeat(60));
    const weakPasswordRequest = {
        body: {
            email: 'user@example.fr',
            password: 'simple',
            name: 'Pierre Dubois',
            terms: true
        }
    };
    const result5 = await validatorFR.validate(weakPasswordRequest);
    console.log(JSON.stringify(result5, null, 2));

    console.log('\n🌐 TEST 6: Validación parcial (Español)');
    console.log('-'.repeat(60));
    const partialRequest = {
        body: {
            email: 'test@test.com',
            password: 'Test1234',
            name: 'Carlos'
        }
    };
    const result6 = await validatorES.validate(partialRequest);
    console.log(JSON.stringify(result6, null, 2));

    console.log('\n TEST 7: Con sesión de idioma (Português)');
    console.log('-'.repeat(60));
    const sessionRequest = {
        body: {
            email: 'invalido',
            password: 'Test123',
            name: 'João'
        },
        session: {
            lang: 'pt'
        }
    };
    const validatorAuto = new Validator(userSchema);
    const result7 = await validatorAuto.validate(sessionRequest);
    console.log(JSON.stringify(result7, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('PRUEBAS COMPLETADAS');
    console.log('='.repeat(60));
}

runTests().catch(console.error);
