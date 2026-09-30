# DATA_DICTIONARY.md

_Placeholder — will be filled with column definitions for customers.csv once the dataset is generated._

## customers.csv / customers_db.json — Field Reference

| Field | Type | Description |
|---|---|---|
| customer_id | string | Unique customer identifier (e.g. CUST000001) |
| driver.name | string | Full name |
| driver.driving_license_number | string | 15-char license in format `^[A-Z]{2}\d{2}\d{4}\d{7}$` |
| driver.age | integer | Age in years |
| driver.driving_experience_years | integer | Years of active driving |
| driver.occupation | string | salaried / self_employed / student / retired / unknown |
| driver.marital_status | string | single / married / divorced / widowed |
| driver.city_tier | string | metro / tier2 / tier3 / rural |
| vehicle.category | string | two_wheeler / three_wheeler / car / commercial |
| vehicle.subtype | string | hatchback / sedan / suv / sports_bike / cruiser / etc. |
| vehicle.engine_cc | integer | Engine displacement in cc |
| vehicle.age_years | integer | Age of vehicle |
| vehicle.market_value_inr | integer | Current market value in INR |
| vehicle.usage | string | personal / commercial |
| vehicle.has_modifications | boolean | Whether vehicle is modified |
| vehicle.fuel_type | string | petrol / diesel / electric / cng |
| vehicle.annual_km | integer | Annual km driven (nullable) |
| insurance_history.is_first_time_buyer | boolean | No prior insurance |
| insurance_history.prior_insurance_years | integer | Years of prior coverage |
| claim_history.claims_last_5y | integer | Number of claims in past 5 years |
| claim_history.at_fault_claims | integer | Number of at-fault claims |
| claim_history.total_claim_amount_inr | integer | Total INR claimed |
| claim_history.months_since_last_claim | integer | Months since last claim (nullable) |
| risk_factors.traffic_violations_3y | integer | Traffic violations in past 3 years |
| risk_factors.license_suspended | boolean | Ever suspended |
| risk_factors.ncb_percent | integer | No-claim bonus percentage |
| risk_factors.previous_policy_lapse | boolean | Prior lapse in coverage |
| risk_factors.night_driving_pct | float | Percentage of driving at night |
| risk_factors.telematics_score | float | Telematics score 0-100 (nullable) |
| label.risk_score | integer | Ground-truth risk score 0-100 |
| label.risk_tier | string | low / medium / high |
