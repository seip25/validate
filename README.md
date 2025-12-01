# Validate-Seip

A lightweight, framework-agnostic JavaScript validation library with built-in internationalization support for Express.js, Next.js, SvelteKit, and other Node.js frameworks.

## Features

- ✅ **Framework Agnostic** - Works with Express.js, Next.js, SvelteKit, and any framework that uses request/response patterns
- 🌍 **Multi-language Support** - Built-in support for English, Spanish, Portuguese, and French
- 🎯 **Comprehensive Validation Rules** - Email, URL, password strength, numeric, alpha, alphanumeric, date, and more
- 🔧 **Customizable Messages** - Override default messages with your own
- 🚀 **Zero Dependencies** - Lightweight and fast
- 📦 **ES Module** - Modern JavaScript module system

## Installation

```bash
npm install validate-seip
```

## Quick Start

```javascript
import { Validator } from '@seip/validate';

// Define your validation schema
const userSchema = {
    email: { required: true, email: true },
    password: { required: true, password: true, min: 6 },
    name: { required: true, min: 3, max: 50 },
    age: { number: true },
    website: { url: true },
    role: { in: ['admin', 'user', 'guest'] },
    terms: { boolean: true, equals: true }
};

// Create a validator instance
const validator = new Validator(userSchema, 'en');

// Validate a request
const result = await validator.validate(req);

if (!result.success) {
    console.log(result.errors); // Array of error messages
}
```

## Usage Examples

### Express.js Middleware

```javascript
import express from 'express';
import { Validator } from 'validate-seip';

const app = express();
app.use(express.json());

const loginSchema = {
    email: { required: true, email: true },
    password: { required: true, min: 6 }
};

const loginValidator = new Validator(loginSchema, 'en');

app.post('/login', loginValidator.middleware(), (req, res) => {
    res.json({ message: 'Login successful' });
});
```

### Next.js API Route

```javascript
import { Validator } from 'validate-seip';

const registerSchema = {
    email: { required: true, email: true },
    password: { required: true, password: true },
    name: { required: true, min: 3 }
};

export default async function handler(req, res) {
    const validator = new Validator(registerSchema, 'en');
    const result = await validator.validate(req);
    
    if (!result.success) {
        return res.status(400).json(result);
    }
    
    // Process registration...
    res.status(200).json({ message: 'Registration successful' });
}
```

### SvelteKit

```javascript
import { Validator } from 'validate-seip';

const profileSchema = {
    name: { required: true, min: 3, max: 50 },
    bio: { max: 500 },
    website: { url: true }
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const req = {
            body: Object.fromEntries(formData)
        };
        
        const validator = new Validator(profileSchema, 'en');
        const result = await validator.validate(req);
        
        if (!result.success) {
            return { errors: result.errors };
        }
        
        // Process form...
        return { success: true };
    }
};
```

## Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| `required` | Field must be present and not empty | `{ required: true }` |
| `min` | Minimum string length | `{ min: 6 }` |
| `max` | Maximum string length | `{ max: 50 }` |
| `email` | Valid email format | `{ email: true }` |
| `number` | Numeric value | `{ number: true }` |
| `alpha` | Only letters (a-z, A-Z) | `{ alpha: true }` |
| `alphanumeric` | Letters and numbers only | `{ alphanumeric: true }` |
| `boolean` | Boolean value | `{ boolean: true }` |
| `date` | Valid ISO 8601 date | `{ date: true }` |
| `url` | Valid URL format | `{ url: true }` |
| `in` | Value must be in array | `{ in: ['admin', 'user'] }` |
| `equals` | Value must equal specific value | `{ equals: true }` |
| `password` | Strong password (uppercase, lowercase, numbers, min 6 chars) | `{ password: true }` |
| `pattern` | Custom regex pattern | `{ pattern: /^[A-Z]/ }` |

## Supported Languages

The library supports the following languages out of the box:

- **English** (`en`)
- **Spanish** (`es`)
- **Portuguese** (`pt`)
- **French** (`fr`)

### Setting Language

```javascript
// Set language explicitly
const validator = new Validator(schema, 'en');

// Use session language (falls back to Spanish if not set)
const validator = new Validator(schema);
const result = await validator.validate(req); // Uses req.session.lang if available
```

## Custom Error Messages

You can override default error messages in two ways:

### 1. Per-field Custom Messages

```javascript
const schema = {
    email: {
        required: true,
        email: true,
        messages: {
            required: 'Please provide your email address',
            email: 'That doesn\'t look like a valid email'
        }
    }
};
```

### 2. Global Custom Messages

```javascript
const customMessages = {
    en: {
        required: (field) => `${field} is mandatory`,
        email: (field) => `Please enter a valid email for ${field}`,
        // ... other rules
    }
};

const validator = new Validator(schema, 'en', customMessages);
```

## Response Format

### Success Response

```javascript
{
    success: true,
    errors: [],
    message: [],
    html: []
}
```

### Error Response

```javascript
{
    success: false,
    errors: [
        "email is required",
        "password must be at least 6 characters"
    ],
    message: [
        "email is required",
        "password must be at least 6 characters"
    ],
    html: [
        '<p class="text-red-500 text-danger">email is required</p>',
        '<p class="text-red-500 text-danger">password must be at least 6 characters</p>'
    ]
}
```

## Advanced Examples

### Combining Multiple Rules

```javascript
const schema = {
    username: {
        required: true,
        alphanumeric: true,
        min: 3,
        max: 20
    },
    password: {
        required: true,
        password: true,
        min: 8
    },
    confirmPassword: {
        required: true,
        equals: req.body.password // Must match password field
    }
};
```

### Custom Pattern Validation

```javascript
const schema = {
    zipCode: {
        required: true,
        pattern: /^\d{5}(-\d{4})?$/ // US ZIP code format
    },
    phoneNumber: {
        pattern: /^\+?[\d\s-()]+$/ // International phone format
    }
};
```

## Testing

Run the included test suite:

```bash
node test.js
```

The test file demonstrates validation in all supported languages with various scenarios.

## API Reference

### `Validator` Class

#### Constructor

```javascript
new Validator(schema, lang_default = null, messages = null)
```

- `schema` (Object): Validation schema defining rules for each field
- `lang_default` (String, optional): Default language code ('en', 'es', 'pt', 'fr')
- `messages` (Object, optional): Custom error messages object

#### Methods

##### `validate(req)`

Validates the request body against the schema.

- **Parameters**: `req` - Request object with `body` property
- **Returns**: Promise resolving to validation result object

##### `middleware()`

Returns an Express.js middleware function that automatically validates and returns 400 status on validation failure.

- **Returns**: Express middleware function

## License

MIT

## Author

Seip25

## Repository

[https://github.com/seip25/validate](https://github.com/seip25/validate)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/seip25/validate/issues) page.
