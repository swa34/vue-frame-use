<template>
	<div>
		<h3 v-if="isPrinciple">
			CAES Principal Investigator:
		</h3>
		<!-- Added by SA 05/05/23 -->
		<h3 v-else-if="options.isCoInvestigator">
			CAES Co-Principal Investigator:
		</h3>
		<!-- End of addition by SA 05/05/23 -->
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
	name: "CaesPersonnelDetails",
	props: {
		options: {
			type: Object,
			required: false,
			default: () => ({ isPrinciple: true, isCoInvestigator: false }) // Added by SA 05/05/23
		}
	},
	data() {
		return {
			...this.options,
			isCoInvestigator: this.options.isCoInvestigator || false
		};
	},
	computed: {
		personnelId() {
			if (this.isPrinciple) return this.$store.state.project.PI_PERSONNEL_ID;
			// Added by SA 05/05/23
			if (this.options.isCoInvestigator)
				return this.$store.state.project.CI_PERSONNEL_ID;
			// End of addition by SA 05/05/23
			return this.$store.state.project.SECONDARY_CONTACT_PERSONNEL_ID;
		},
		personnel() {
			const nullPi = { name: null, email: null, phone: null };
			if (!this.personnelId) return nullPi;

			// Added by SA 05/05/23
			let listKey;
			if (this.isPrinciple) {
				listKey = "principleInvestigators";
			} else if (this.options.isCoInvestigator) {
				listKey = "coInvestigators";
			} else {
				listKey = "secondaryContacts";
			}
			// End of addition by SA 05/05/23

			const filteredList = caesCache.data.crfp[listKey].filter(
				p => p.PERSONNEL_ID === this.personnelId
			);
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
