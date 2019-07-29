<template>
	<div>
		<h3 v-if="isPrinciple">
			CAES Principle Investigator:
		</h3>
		<h3 v-else>
			CAES Secondary Contact:
		</h3>
		<p v-if="personnelId">
			{{ personnel.name }}
			<br />
			<a :href="`mailto:${personnel.email}`">{{ personnel.email }}</a>
			<br />
			<a :href="`tel:${personnel.phone}`">{{ personnel.phone }}</a>
			<br />
			<!-- {{ personnel.department }} -->
		</p>
		<p v-else>
			<em>(None)</em>
		</p>
	</div>
</template>

<script>
	/* global caesCache */
	export default {
		name: 'CaesPersonnelDetails',
		props: {
			options: {
				type: Object,
				required: false,
				default: () => ({ isPrinciple: true })
			}
		},
		data () {
			return { ...this.options };
		},
		computed: {
			personnelId () { return this.isPrinciple ? this.$store.state.project.PI_PERSONNEL_ID : this.$store.state.project.SECONDARY_CONTACT_PERSONNEL_ID; },
			personnel () {
				const nullPi = { name: null, email: null, phone: null };
				if (!this.personnelId) return nullPi;
				const filteredList = caesCache.data.crfp[this.isPrinciple ? 'principleInvestigators' : 'secondaryContacts'].filter(p => p.PERSONNEL_ID === this.personnelId);
				if (filteredList.length < 1) return nullPi;
				const personnelRecord = filteredList[0];
				return {
					name: personnelRecord.FULL_NAME_LAST_FIRST,
					email: personnelRecord.EMAIL,
					phone: personnelRecord.PHONE_NUMBER
				};
			}
		}
	};
</script>
