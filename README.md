# Wander Data

Data for the Wander wallet.

## Files

### Tokens

- `tokens/flp-tokens.json` - Token metadata (formatted)
- `tokens/flp-tokens.min.json` - Token metadata (minified)

#### Token Schema

```json
{
  "Name": "string",
  "Ticker": "string", 
  "Denomination": "number",
  "Logo": "string",
  "Id": "string"
}
```

#### Usage

```javascript
const response = await fetch('https://cdn.jsdelivr.net/gh/wanderwallet/wander-data@main/tokens/flp-tokens.min.json');
const tokens = await response.json();
```
