<template lang="html">
	<div>
		<h3>
			4H Enrollment Import
		</h3>
		<p>
			Entering a 4-H Youth activity report?  If you'd like, you may import demographic information from the 4-H Enrollment system using the button below.
		</p>
		<p>
			<em>
				(Note: This will overwrite any demographics information you have already entered manually.)
			</em>
		</p>
		<button type="button" v-on:click="openModal" class="load-modal">
			<img src="/global/images/4h-logo-white-transparent.svg" /> Import
		</button>
		<div v-if="displayModal" class="modal">
			<div class="container">
				<span class="close">
					<XIcon v-on:click="closeModal" />
				</span>
				<h2>
					4-H Enrollment Activity Import
				</h2>
				<div>
					<p class="instructions">
						Use the following fields to select the 4-H enrollment activity whose demographic information you'd like to import.
						<ul>
							<li>
								First, select the county where the activity took place.
							</li>
							<li>
								Then, select the activity from the drop-down menu.
							</li>
							<li>
								When you've made your selection, simply hit the import button!
							</li>
						</ul>
					</p>
					<form>
						<label>
							<strong>
								County
							</strong>
							<select v-model="countyName" :disabled="counties.length < 1">
								<option v-for="county in counties" v-bind:key="county.ID" :value="county.COUNTYNAME">
									{{ county.COUNTYNAME}}
								</option>
							</select>
						</label>
						<label>
							<strong>
								Activity
							</strong>
							<select v-model="activityID" :disabled="activities.length < 1">
								<option v-for="activity in activities" v-bind:key="activity.ACTIVITY_ID" :value="activity.ACTIVITY_ID">
									{{ activity.NAME }} - {{ activity.BEGIN_DATE.replace(/ ([0-9]{2}:){2}[0-9]{2}$/, '') }}
								</option>
							</select>
						</label>
						<button type="button" v-on:click="fetchActivity" :disabled="!activityID">
							Import
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/* global activeUser */
	/* global notify */
	import { XIcon } from 'vue-feather-icons';
	import {
		get4HActivity,
		get4HActivityList,
		getCounties
	} from '@/modules/caesdb';

	export default {
		name: 'FourHImport',
		components: { XIcon },
		data () {
			return {
				activityID: null,
				activities: [],
				countyName: null,
				counties: [],
				displayModal: false
			};
		},
		methods: {
			closeModal () {
				this.displayModal = false;
			},
			fetchActivity () {
				get4HActivity({ activityID: this.activityID }, (err, data) => {
					if (err) {
						console.error(err);
					} else if (data.Message) {
						console.error(new Error(data.Message));
					} else {
						console.log(data[0]);
					}
				});
			},
			fetchActivityList () {
				get4HActivityList({ countyName: this.countyName }, (err, data) => {
					if (err) {
						console.error(err);
					} else if (data.Message) {
						console.error(new Error(data.Message));
					} else {
						if (data.length < 1 && this.displayModal) this.notifyUserAboutNoActivities();
						this.activities = data;
					}
				});
			},
			fetchCountyList () {
				getCounties((err, data) => {
					if (err) {
						console.error(err);
					} else if (data.Message) {
						console.error(new Error(data.Message));
					} else {
						this.counties = data;
						console.log(this.$store.state.report.COUNTY_ID);
						console.log(activeUser.COUNTYLISTID);
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
					this.displayModal = true;
					if (this.countyName && this.counties.length < 1) this.notifyUserAboutNoActivities();
				}
			},
			setCountyName (countyID) {
				countyID = Number(countyID);
				const countyIndex = this.counties.map(c => c.COUNTYLISTID).indexOf(countyID);
				console.log(countyIndex);
				if (countyIndex > -1) this.countyName = this.counties[countyIndex].COUNTYNAME;
			},
			setDemographics (data) {
				const setAssociationRecordValue = (association, identifier, key, value) => {
					const index = this.$store.state[association].records.map(r => r[identifier.key]).indexOf(identifier.value);
					if (index !== -1) {
						this.$store.state[association].records[index][key] = value;
					}
				};
				const translation = {
					CONTACTS: {
						association: 'contacts',
						identifier: {
							key: 'TYPE_ID',
							value: 1
						},
						key: 'QUANTITY'
					},
					WHITE_MALE: {
						association: 'racialDemographics',
						identifier: {
							key: 'RACE_ID',
							value: 1
						},
						key: 'QUANTITY_MALE'
					},
					WHITE_FEMALE: {
						association: 'racialDemographics',
						identifier: {
							key: 'RACE_ID',
							value: 1
						},
						key: 'QUANTITY_FEMALE'
					},
					BLACK_MALE: {
						association: 'racialDemographics',
						identifier: {
							key: 'RACE_ID'
						}
					}
				}
				for (let key in data) {

				}
			}
		},
		mounted () {
			this.fetchCountyList();
		},
		watch: {
			countyName () {
				this.fetchActivityList();
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
				justify-content: center;
				align-items: flex-end;
				label {
					margin-right: 2rem;
				}
				button[disabled=disabled] {
					background: #ccc;
					cursor: default;
				}
			}
		}
	}
</style>
