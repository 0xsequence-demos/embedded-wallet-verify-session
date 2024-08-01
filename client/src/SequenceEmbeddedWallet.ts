import { SequenceWaaS } from '@0xsequence/waas'

const sequence = new SequenceWaaS({
    projectAccessKey: import.meta.env.VITE_PROJECT_ACCESS_KEY || 'AQAAAAAAADVH8R2AGuQhwQ1y8NaEf1T7PJM',
    waasConfigKey:  import.meta.env.VITE_WAAS_CONFIG_KEY || 'eyJwcm9qZWN0SWQiOjEzNjM5LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=',
    network: 'arbitrum-sepolia'
})

export default sequence;