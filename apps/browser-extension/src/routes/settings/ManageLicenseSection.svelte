<script lang="ts">
	import { Button } from '@webselect-ai/ui';
	import customer from '$lib/stores/stripe-customer';
	import { daysLeftToDate } from '@webselect-ai/utils';
</script>

<div class="manage-license">
	<p>
		{$customer?.activeSubscription?.subscriptionType === 'year' ? `Yearly` : `Lifetime`} License
		{$customer?.activeSubscription?.isTrial && $customer.activeSubscription.period
			? `(Trial ends in ${daysLeftToDate($customer.activeSubscription.period.end)} days)`
			: ``}
	</p>
	{#if $customer?.activeSubscription?.period}
		{#if !$customer?.activeSubscription?.isTrial}
			<p>
				Subscription renews in {daysLeftToDate($customer.activeSubscription.period.end)} days
			</p>
		{/if}
	{/if}
	{#if $customer?.activeSubscription?.url}
		<Button href={$customer?.activeSubscription?.url} target="_blank">
			Manage your subscription
		</Button>
	{/if}
</div>
