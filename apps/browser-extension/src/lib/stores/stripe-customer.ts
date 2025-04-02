import { writable, type Writable } from 'svelte/store';

const customer: Writable<CustomerData | null> = writable(null);

export default customer;
