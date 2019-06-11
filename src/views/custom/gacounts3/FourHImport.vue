<template lang="html">
	<div v-if="isNew">
		<button type="button" class="load-modal" @click="openModal">
			<img src="/global/images/4h-logo-white-transparent.svg" /> Import 4-H Enrollment Activity Demographics
		</button>
		<div v-if="displayModal" class="modal" @click="closeModal">
			<div class="container">
				<span class="close">
					<XIcon @click="closeModal" />
				</span>
				<h2>
					4-H Enrollment Activity Import
				</h2>
				<div v-if="!loadingActivity">
					<form>
						<label>
							<strong>
								County
							</strong>
							<select v-model="countyName" :disabled="counties.length < 1">
								<option v-for="county in counties" :key="county.ID" :value="county.COUNTYNAME">
									{{ county.COUNTYNAME }}
								</option>
							</select>
						</label>
						<label class="activity">
							<strong>
								Activity
							</strong>
							<select v-if="!loadingActivityList" v-model="activityID" :disabled="activities.length < 1">
								<option v-for="activity in activities" :key="activity.ACTIVITY_ID" :value="activity.ACTIVITY_ID">
									{{ activity.NAME }} - {{ activity.BEGIN_DATE.replace(/ ([0-9]{2}:){2}[0-9]{2}$/, '') }}
								</option>
							</select>
							<Spinner v-else />
						</label>
						<div class="button-container">
							<button type="button" :disabled="!activityID" @click="fetchActivity">
								Import
							</button>
						</div>
					</form>
				</div>
				<Spinner v-else />
			</div>
		</div>
	</div>
</template>

<script>
	/* global activeUser */
	/* global notify */
	/* global swal */
	import Spinner from 'vue-simple-spinner';
	import XIcon from 'vue-feather-icons/icons/XIcon';
	import { logError } from '@/modules/caesdb';
	import {
		get4HActivity,
		get4HActivityList,
		getCounties
	} from '@/modules/caesdb/gacounts3';
	import { url } from '@/modules/utilities';

	export default {
		name: 'FourHImport',
		components: {
			Spinner,
			XIcon
		},
		props: {
			'mode': {
				type: String,
				default: 'view',
				validator (value) {
					return ['edit', 'view'].indexOf(value) !== -1;
				}
			}
		},
		data () {
			return {
				activityID: null,
				activities: [],
				countyName: null,
				counties: [],
				displayModal: false,
				loadingActivity: false,
				loadingActivityList: false
			};
		},
		computed: {
			isNew () { return url.getParam('new') !== null; }
		},
		watch: {
			countyName () {
				this.activityID = null;
				this.fetchActivityList();
			}
		},
		mounted () {
			if (this.isNew) this.fetchCountyList();
		},
		methods: {
			closeModal (event) {
				if (event.target.matches('div.modal') || event.target.matches('span.close svg.feather')) this.displayModal = false;
			},
			fetchActivity () {
				this.loadingActivity = true;
				get4HActivity({ activityID: this.activityID }, (err, data) => {
					if (err) {
						logError(err);
					} else if (data && data.length > 0) {
						this.setDemographics(data[0]);
					}
				});
			},
			fetchActivityList () {
				this.loadingActivityList = true;
				// Hijack pending requests since we'll already have a spinner wheel for
				// this request
				--window.pendingRequests;
				get4HActivityList({ countyName: this.countyName }, (err, data) => {
					// Fix our hijacked pending requests
					++window.pendingRequests;
					if (err) {
						logError(err);
					} else if (data) {
						if (data.length < 1 && this.displayModal) this.notifyUserAboutNoActivities();
						this.activities = data;
						this.loadingActivityList = false;
					}
				});
			},
			fetchCountyList () {
				getCounties((err, data) => {
					if (err) {
						logError(err);
					} else if (data) {
						this.counties = data;
						if (this.$store.state.report.COUNTY_ID) {
							this.setCountyName(this.$store.state.report.COUNTY_ID);
						} else if (activeUser.COUNTYLISTID) {
							this.setCountyName(activeUser.COUNTYLISTID);
						}
					}
				});
			},
			notifyUserAboutNoActivities () {
				notify.warn('No 4-H enrollment activities were found for ' + this.countyName + ' county.');
			},
			openModal () {
				if (!this.dataImported) {
					this.$emit('expand-section', 'Supplemental Data');
					this.displayModal = true;
					if (this.countyName && this.counties.length < 1) this.notifyUserAboutNoActivities();
				}
			},
			setCountyName (countyID) {
				countyID = Number(countyID);
				const countyIndex = this.counties.map(c => c.COUNTYLISTID).indexOf(countyID);
				if (countyIndex > -1) this.countyName = this.counties[countyIndex].COUNTYNAME;
			},
			setDemographics (data) {
				// Contacts
				const faceToFaceIndex = this.$store.state.contacts.records.map(r => r.TYPE_ID).indexOf(1);
				if (faceToFaceIndex !== -1) this.$store.state.contacts.records[faceToFaceIndex].QUANTITY = data.CONTACTS;

				// Racial Demographics
				const raceMap = this.$store.state.racialDemographics.records.map(r => r.RACE_ID);
				const races = {
					WHITE: raceMap.indexOf(1),
					BLACK: raceMap.indexOf(2),
					ASIAN: raceMap.indexOf(3),
					AMERICAN_INDIAN: raceMap.indexOf(4),
					PACIFIC_ISLANDER: raceMap.indexOf(5)
				};
				for (let key in races) {
					const index = races[key];
					if (index !== -1) {
						['MALE', 'FEMALE'].forEach((gender) => {
							this.$store.state.racialDemographics.records[index]['QUANTITY_' + gender] = data[key + '_' + gender];
						});
					}
				}

				// Ethnic Demographics
				const hispanicIndex = this.$store.state.ethnicDemographics.records.map(r => r.ETHNICITY_ID).indexOf(1);
				if (hispanicIndex !== -1) {
					this.$store.state.ethnicDemographics.records[hispanicIndex].QUANTITY_MALE = data.HISPANIC_MALE;
					this.$store.state.ethnicDemographics.records[hispanicIndex].QUANTITY_FEMALE = data.HISPANIC_FEMALE;
				}

				// Residence demographics
				const residenceMap = this.$store.state.residenceDemographics.records.map(r => r.TYPE_ID);
				const residences = {
					FARM: residenceMap.indexOf(1),
					RURAL: residenceMap.indexOf(2),
					TOWN: residenceMap.indexOf(3),
					SUBURBAN: residenceMap.indexOf(4),
					CITY: residenceMap.indexOf(5)
				};
				for (let key in residences) {
					const index = residences[key];
					if (index !== -1) {
						this.$store.state.residenceDemographics.records[index].QUANTITY = data[key];
					}
				}

				// Target Audiences
				const targAudMap = this.$store.state.targetAudiences.records.map(r => r.TYPE_ID);
				const audiences = {
					PRE_K: targAudMap.indexOf(23),
					FOUR: targAudMap.indexOf(25),
					FIVE: targAudMap.indexOf(26),
					SIX: targAudMap.indexOf(27),
					SEVEN: targAudMap.indexOf(28),
					EIGHT: targAudMap.indexOf(29),
					NINE: targAudMap.indexOf(30),
					TEN: targAudMap.indexOf(31),
					ELEVEN: targAudMap.indexOf(32),
					TWELVE: targAudMap.indexOf(33),
					COLLEGIATE: targAudMap.indexOf(34),
					ADULT: targAudMap.indexOf(35),
					UGA_STAFF: targAudMap.indexOf(37)
				};
				for (let key in audiences) {
					const index = audiences[key];
					if (index !== -1) {
						this.$store.state.targetAudiences.records[index].QUANTITY = data[key];
					}
				}
				const k3Index = targAudMap.indexOf(24);
				this.$store.state.targetAudiences.records[k3Index].QUANTITY = data.KINDERGARTEN + data.ONE + data.TWO + data.THREE;

				// Supplemental Data
				const supMap = this.$store.state.supplementalData.records.map(r => r.FIELD_ID);
				const supps = {
					TOTAL_ADULT_VOLUNTEERS: supMap.indexOf(1),
					TOTAL_VOLUNTEER_HOURS: supMap.indexOf(2),
					TOTAL_YOUTH_VOLUNTEERS: supMap.indexOf(37),
					MILITARY_CONTACTS: supMap.indexOf(35)
				};
				for (let key in supps) {
					const index = supps[key];
					if (index !== -1) {
						this.$store.state.supplementalData.records[index].FIELD_VALUE = data[key];
					}
				}

				// We're done loading content
				this.loadingActivity = false;
				this.displayModal = false;
				swal('Success!', 'Your 4-H activity data has been imported.', 'success');
			}
		}
	};
</script>

<style lang="scss" scoped>
	button.load-modal {
		background: #339966;
		img {
			height: 1.5rem;
			margin-right: .5rem;
			vertical-align: middle;
		}
	}
	div.modal {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,.15);
		padding-top: 1rem;
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		span.close {
			display: block;
			text-align: right;
			svg {
				cursor: pointer;
			}
		}
		div.container {
			background: #fff;
			max-width: 960px;
			margin: 0 auto;
			padding: 1rem;
			box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
			display: inline-block;
			border-radius: .375rem;
			text-align: left;
			h2 {
				text-align: center;
			}
			form {
				display: flex;
				flex-wrap: wrap;
				// justify-content: center;
				label {
					margin-right: 2rem;
					&.activity {
						display: flex;
						flex-direction: column;
						div {
							flex-grow: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							width: 20rem;
						}
						select {
							width: 20rem;
						}
					}
				}
				div.button-container {
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					button[disabled=disabled] {
						background: #ccc;
						cursor: default;
					}
				}
			}
		}
	}
</style>
