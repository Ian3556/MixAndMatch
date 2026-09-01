# Catalogue source status

Snapshot date: 2026-08-08  
Environment: local development architecture only

No brand below is claimed to be automatically supported. Every source starts
`manual_seed_required` until its terms, robots policy, public access behaviour, domains, and entry
URLs are reviewed. Validated counts remain zero until a real migrated database contains products
that passed the canonical pipeline.

| Brand                    | Import Method                          | Status               | Validated | Target | Notes                                                                      |
| ------------------------ | -------------------------------------- | -------------------- | --------: | -----: | -------------------------------------------------------------------------- |
| Burberry                 | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Prada                    | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Gucci                    | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Saint Laurent            | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Bottega Veneta           | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Ralph Lauren             | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| A.P.C.                   | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| COS                      | Phase A candidate; source not approved | manual_seed_required |         0 |    150 | Use offline fixtures first, then approve one controlled public source.     |
| AMI Paris                | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Acne Studios             | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Zara                     | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Do not assume automated access; record blocks without circumvention.       |
| Uniqlo                   | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Apparel-led category targets; source approval still required.              |
| H&M                      | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Do not assume automated access; record blocks without circumvention.       |
| Mango                    | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Massimo Dutti            | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Supreme                  | Manual seed / authorized feed TBD      | manual_seed_required |         0 |    150 | Limited releases require a controlled, evidence-based source plan.         |
| Stüssy                   | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Review source terms, robots policy, and approved entry URLs.               |
| Carhartt WIP             | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Workwear-led category targets; source approval still required.             |
| Palace                   | Manual seed / authorized feed TBD      | manual_seed_required |         0 |    150 | Limited releases require a controlled, evidence-based source plan.         |
| Fear of God / Essentials | Manual seed / authorized feed TBD      | manual_seed_required |         0 |    150 | Confirm brand/collection identity and authorized source boundaries.        |
| Nike                     | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Footwear-led category targets; source approval still required.             |
| Adidas                   | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Footwear-led category targets; source approval still required.             |
| New Balance              | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Strong footwear distribution is expected; do not fabricate apparel quotas. |
| Puma                     | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Footwear-led category targets; source approval still required.             |
| ASICS                    | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Strong footwear distribution is expected; source approval still required.  |
| Arc'teryx                | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Technical outerwear-led targets; source approval still required.           |
| The North Face           | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Outdoor/outerwear-led targets; source approval still required.             |
| Patagonia                | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Outdoor/outerwear-led targets; source approval still required.             |
| Salomon                  | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Trail-footwear-led targets; source approval still required.                |
| Columbia                 | Manual URL / authorized feed TBD       | manual_seed_required |         0 |    150 | Outdoor/outerwear-led targets; source approval still required.             |

## Status changes

Update a brand or source only with recorded evidence:

- `ready`: configuration is reviewed and ready for a controlled Phase A run;
- `supported`: the approved method is working and locally validated;
- `partially_supported`: some categories/pages work, with documented gaps;
- `manual_seed_required`: automated ingestion is not approved or reliable;
- `blocked`: access controls or policy prevent use; do not circumvent;
- `unavailable`: no acceptable public or authorized source exists;
- `completed`: the validated target and quality review are complete.

Record blocked/unavailable reasons in the database and this document. Never change a status merely
to make dashboard progress look complete.
