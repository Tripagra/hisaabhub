import React, { useState } from 'react';
import { BookOpen, TrendingUp, Shield, Calculator, FileText, ChevronRight, Clock, User } from 'lucide-react';

// Component to render article content with proper formatting
const ArticleContent: React.FC<{ content: string }> = ({ content }) => {
    const renderContent = () => {
        const lines = content.trim().split('\n');
        const elements: React.ReactElement[] = [];
        let currentList: string[] = [];
        let listType: 'ul' | 'ol' | null = null;

        const flushList = () => {
            if (currentList.length > 0) {
                elements.push(
                    listType === 'ul' ? (
                        <ul key={elements.length} className="list-disc list-inside space-y-2 mb-6 text-slate-300 ml-4">
                            {currentList.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ul>
                    ) : (
                        <ol key={elements.length} className="list-decimal list-inside space-y-2 mb-6 text-slate-300 ml-4">
                            {currentList.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ol>
                    )
                );
                currentList = [];
                listType = null;
            }
        };

        const formatInline = (text: string) => {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/₹/g, '₹')
                .replace(/✅/g, '<span class="text-green-400">✅</span>')
                .replace(/❌/g, '<span class="text-red-400">❌</span>');
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
                flushList();
                return;
            }

            // H1
            if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('## ')) {
                flushList();
                elements.push(
                    <h1 key={index} className="text-3xl font-bold text-primary mb-6 mt-8">
                        {trimmedLine.substring(2)}
                    </h1>
                );
            }
            // H2
            else if (trimmedLine.startsWith('## ') && !trimmedLine.startsWith('### ')) {
                flushList();
                elements.push(
                    <h2 key={index} className="text-2xl font-bold text-primary/90 mb-4 mt-8">
                        {trimmedLine.substring(3)}
                    </h2>
                );
            }
            // H3
            else if (trimmedLine.startsWith('### ')) {
                flushList();
                elements.push(
                    <h3 key={index} className="text-xl font-semibold text-white mb-3 mt-6">
                        {trimmedLine.substring(4)}
                    </h3>
                );
            }
            // Unordered list
            else if (trimmedLine.startsWith('- ')) {
                if (listType !== 'ul') {
                    flushList();
                    listType = 'ul';
                }
                currentList.push(formatInline(trimmedLine.substring(2)));
            }
            // Ordered list
            else if (/^\d+\.\s/.test(trimmedLine)) {
                if (listType !== 'ol') {
                    flushList();
                    listType = 'ol';
                }
                currentList.push(formatInline(trimmedLine.replace(/^\d+\.\s/, '')));
            }
            // Checkbox list
            else if (trimmedLine.startsWith('- [ ]') || trimmedLine.startsWith('- [x]')) {
                if (listType !== 'ul') {
                    flushList();
                    listType = 'ul';
                }
                const checked = trimmedLine.startsWith('- [x]');
                const text = trimmedLine.substring(6);
                currentList.push(
                    `<span class="${checked ? 'text-green-400' : 'text-slate-400'}">${checked ? '✓' : '○'} ${formatInline(text)}</span>`
                );
            }
            // Regular paragraph
            else {
                flushList();
                elements.push(
                    <p
                        key={index}
                        className="text-slate-300 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: formatInline(trimmedLine) }}
                    />
                );
            }
        });

        flushList();
        return elements;
    };

    return <div className="article-content">{renderContent()}</div>;
};

interface Article {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    author: string;
    icon: React.ReactNode;
}

const LearnPage: React.FC = () => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const articles: Article[] = [
        {
            id: 1,
            title: "Understanding the Indian Tax System: A Complete Guide",
            excerpt: "Learn about the structure of Indian taxation, different tax slabs, and how the system works for individuals and businesses.",
            category: "Income Tax",
            readTime: "8 min read",
            author: "Tax Expert",
            icon: <BookOpen className="h-6 w-6" />,
            content: `
# Understanding the Indian Tax System: A Complete Guide

The Indian tax system is a comprehensive framework designed to collect revenue for the government while ensuring equitable distribution of the tax burden. Here's everything you need to know:

## Structure of Indian Taxation

India follows a **three-tier federal structure** of taxation:
- **Central Government**: Income Tax, GST (partial), Customs Duty
- **State Government**: GST (partial), Stamp Duty, Professional Tax
- **Local Bodies**: Property Tax, Municipal Taxes

## Income Tax Slabs for FY 2024-25

### New Tax Regime (Default)
- ₹0 - ₹3,00,000: Nil
- ₹3,00,001 - ₹7,00,000: 5%
- ₹7,00,001 - ₹10,00,000: 10%
- ₹10,00,001 - ₹12,00,000: 15%
- ₹12,00,001 - ₹15,00,000: 20%
- Above ₹15,00,000: 30%

### Old Tax Regime (Optional)
- ₹0 - ₹2,50,000: Nil
- ₹2,50,001 - ₹5,00,000: 5%
- ₹5,00,001 - ₹10,00,000: 20%
- Above ₹10,00,000: 30%

## Key Components

### 1. Direct Taxes
Taxes paid directly to the government:
- **Income Tax**: On salary, business income, capital gains
- **Corporate Tax**: On company profits
- **Wealth Tax**: (Currently abolished)

### 2. Indirect Taxes
Taxes collected by intermediaries:
- **GST**: Goods and Services Tax
- **Customs Duty**: On imports
- **Excise Duty**: On manufactured goods

## Filing Requirements

**Who Must File ITR?**
- Income above ₹2.5 lakhs (₹3 lakhs for senior citizens)
- Foreign assets or income
- Company directors
- High-value transactions (property, shares, etc.)

## Important Deadlines
- **Individuals**: July 31st (for previous financial year)
- **Businesses**: October 31st
- **Audit Cases**: September 30th

## Penalties for Non-Compliance
- Late filing: ₹5,000 (₹1,000 if income < ₹5 lakhs)
- Tax evasion: 100-300% of tax amount
- Non-filing: Prosecution under Section 276CC
            `
        },
        {
            id: 2,
            title: "GST Explained: Everything You Need to Know",
            excerpt: "Comprehensive guide to Goods and Services Tax in India, its types, registration process, and compliance requirements.",
            category: "GST",
            readTime: "10 min read",
            author: "GST Specialist",
            icon: <FileText className="h-6 w-6" />,
            content: `
# GST Explained: Everything You Need to Know

Goods and Services Tax (GST) revolutionized India's indirect tax system by replacing multiple taxes with a unified structure. Here's your complete guide:

## What is GST?

GST is a **destination-based, multi-stage, comprehensive tax** levied on every value addition. It's a single tax on the supply of goods and services from manufacturer to consumer.

## Types of GST

### 1. CGST (Central GST)
Collected by the Central Government on intra-state supplies.

### 2. SGST (State GST)
Collected by the State Government on intra-state supplies.

### 3. IGST (Integrated GST)
Collected by the Central Government on inter-state supplies and imports.

### 4. UGST (Union Territory GST)
Applicable in Union Territories without legislature.

## GST Registration

### Who Must Register?
- Businesses with turnover > ₹40 lakhs (₹20 lakhs for special category states)
- Service providers with turnover > ₹20 lakhs (₹10 lakhs for special states)
- E-commerce operators
- Inter-state suppliers
- Casual taxable persons

### Registration Process
1. Visit GST Portal (www.gst.gov.in)
2. Fill Part A of Form GST REG-01
3. Verify OTP and complete Part B
4. Upload required documents
5. Receive GSTIN within 3-7 working days

## GST Rates Structure

- **0%**: Essential items (grains, milk, eggs)
- **5%**: Common use items (edible oil, sugar, tea)
- **12%**: Standard goods (computers, processed food)
- **18%**: Most goods and services
- **28%**: Luxury items (cars, tobacco, aerated drinks)

## Input Tax Credit (ITC)

**What is ITC?**
Mechanism to avoid tax on tax. You can claim credit for GST paid on purchases against GST collected on sales.

**Conditions for ITC:**
- Possession of valid tax invoice
- Goods/services received
- Tax paid to government by supplier
- Return filed on time

## GST Returns

### Regular Returns
- **GSTR-1**: Monthly/Quarterly (Outward supplies)
- **GSTR-3B**: Monthly (Summary return)
- **GSTR-9**: Annual return

### Due Dates
- GSTR-1: 11th of next month
- GSTR-3B: 20th of next month
- GSTR-9: December 31st of next financial year

## Benefits of GST

✅ **Simplified Tax Structure**: One nation, one tax
✅ **Reduced Tax Burden**: Elimination of cascading effect
✅ **Improved Compliance**: Online processes and transparency
✅ **Boost to Economy**: Easier interstate trade
✅ **Competitive Pricing**: Lower overall tax burden

## Common Mistakes to Avoid

❌ Missing filing deadlines
❌ Incorrect GSTIN in invoices
❌ Not reconciling ITC with GSTR-2A
❌ Ignoring reverse charge mechanism
❌ Poor record maintenance

## Penalties

- Late filing: ₹50/day (CGST) + ₹50/day (SGST)
- Non-registration: 100% of tax amount
- Tax evasion: 100% of tax + imprisonment
            `
        },
        {
            id: 3,
            title: "Tax Saving Strategies: Maximize Your Deductions",
            excerpt: "Discover legal ways to reduce your tax liability through smart investments and deductions under various sections.",
            category: "Tax Planning",
            readTime: "12 min read",
            author: "Financial Advisor",
            icon: <TrendingUp className="h-6 w-6" />,
            content: `
# Tax Saving Strategies: Maximize Your Deductions

Smart tax planning can significantly reduce your tax liability while building wealth. Here are proven strategies to maximize your savings:

## Section 80C Deductions (Up to ₹1.5 Lakhs)

### Investment Options
1. **Public Provident Fund (PPF)**
   - Lock-in: 15 years
   - Interest: ~7.1% (tax-free)
   - Best for: Long-term wealth creation

2. **Equity Linked Savings Scheme (ELSS)**
   - Lock-in: 3 years (shortest)
   - Returns: Market-linked (potentially high)
   - Best for: Growth-oriented investors

3. **National Pension System (NPS)**
   - Additional ₹50,000 deduction under 80CCD(1B)
   - Lock-in: Till retirement
   - Best for: Retirement planning

4. **Life Insurance Premium**
   - Term insurance premiums qualify
   - Max 10% of sum assured
   - Best for: Family protection + tax saving

5. **Home Loan Principal Repayment**
   - Principal portion qualifies
   - Combined with 80C limit
   - Best for: Homeowners

6. **Children's Tuition Fees**
   - Max 2 children
   - Only tuition fees (not development fees)
   - Best for: Parents

## Section 80D: Health Insurance (Up to ₹75,000)

- **Self & Family**: ₹25,000
- **Parents (below 60)**: ₹25,000
- **Parents (above 60)**: ₹50,000
- **Preventive Health Checkup**: ₹5,000

**Pro Tip**: Pay premium for parents to maximize deduction!

## Section 24(b): Home Loan Interest (Up to ₹2 Lakhs)

- Interest on home loan for self-occupied property
- No limit for let-out property
- Can claim from year of possession

## Section 80E: Education Loan Interest

- **No upper limit** on deduction
- Available for 8 years or till repayment
- Loan for self, spouse, or children

## Section 80G: Donations

- 50% or 100% deduction based on institution
- Must donate to approved charitable organizations
- Keep donation receipts

## House Rent Allowance (HRA)

**Exemption Calculation** (Minimum of):
- Actual HRA received
- 50% of salary (metro) or 40% (non-metro)
- Rent paid minus 10% of salary

**Pro Tip**: If not receiving HRA, claim deduction under Section 80GG!

## Leave Travel Allowance (LTA)

- 2 journeys in a block of 4 years
- Only domestic travel
- Actual travel cost or LTA received (whichever is lower)

## Standard Deduction: ₹50,000

- Available to all salaried individuals
- No documentation required
- Automatic deduction from gross salary

## Advanced Tax Planning Strategies

### 1. Salary Restructuring
Optimize components:
- Increase HRA, LTA, meal coupons
- Reduce basic salary (within limits)
- Maximize tax-free allowances

### 2. Tax Loss Harvesting
- Book losses in equity to offset gains
- Carry forward losses for 8 years
- Strategic selling before March 31st

### 3. Clubbing Income
- Avoid clubbing provisions
- Gift to spouse carefully
- Use HUF (Hindu Undivided Family) structure

### 4. Timing of Income
- Defer income to next FY if in higher bracket
- Advance deductions to current FY
- Strategic bonus/incentive timing

## Tax Regime Comparison

### When to Choose Old Regime?
- Multiple deductions (80C, 80D, HRA)
- Home loan interest
- High investment in tax-saving instruments

### When to Choose New Regime?
- Minimal deductions
- Higher income (>₹15 lakhs)
- Simple tax filing preference

## Common Tax-Saving Mistakes

❌ Last-minute investments (March rush)
❌ Ignoring long-term financial goals
❌ Not maintaining investment proofs
❌ Choosing wrong tax regime
❌ Missing deadlines for tax-saving FDs

## Tax-Free Income Sources

✅ Agricultural income
✅ PPF maturity & interest
✅ Life insurance maturity (conditions apply)
✅ Gifts from relatives
✅ Scholarships
✅ Gratuity (up to ₹20 lakhs)

## Action Plan for Maximum Savings

**April-June**: Plan annual investments
**July-September**: Start SIPs in ELSS
**October-December**: Review and adjust
**January-March**: Complete remaining investments

**Remember**: Tax saving should align with financial goals, not just reduce taxes!
            `
        },
        {
            id: 4,
            title: "Business Tax Benefits: Deductions for Entrepreneurs",
            excerpt: "Explore tax advantages available to business owners, startups, and self-employed professionals in India.",
            category: "Business Tax",
            readTime: "9 min read",
            author: "CA Professional",
            icon: <Calculator className="h-6 w-6" />,
            content: `
# Business Tax Benefits: Deductions for Entrepreneurs

Running a business comes with unique tax advantages. Here's how to leverage them effectively:

## Startup Tax Benefits

### Section 80-IAC: Tax Holiday for Startups
- **100% tax exemption** for 3 consecutive years out of first 10 years
- Turnover should not exceed ₹100 crores
- Must be DPIIT registered
- Incorporated after April 1, 2016

### Eligibility Criteria
✅ Private Limited or LLP
✅ Innovative business model
✅ Scalable with potential for employment
✅ Annual turnover < ₹100 crores

## Business Expense Deductions

### 1. Operating Expenses (100% Deductible)
- Office rent and utilities
- Employee salaries and benefits
- Professional fees (CA, lawyer)
- Marketing and advertising
- Travel and conveyance
- Telephone and internet
- Stationery and supplies

### 2. Depreciation Benefits
- **Computers & Software**: 40%
- **Furniture**: 10%
- **Vehicles**: 15%
- **Machinery**: 15-40% (based on type)
- **Buildings**: 5-10%

### 3. Interest on Business Loans
- 100% deductible
- No upper limit
- Includes working capital loans
- Term loans for assets

## Section 35: R&D Expenditure

- **150% weighted deduction** for in-house R&D
- **100% deduction** for payments to research institutions
- Encourages innovation and development

## Section 35AD: Specified Business Deductions

**100% deduction** for capital expenditure in:
- Cold chain facilities
- Warehousing
- Affordable housing projects
- Production of fertilizers
- Laying and operating cross-country pipelines

## Presumptive Taxation Schemes

### Section 44AD: For Small Businesses
- Turnover up to ₹2 crores (₹3 crores for digital receipts)
- Deemed profit: **8% of turnover** (6% for digital)
- Simplified compliance
- No need to maintain books

**Benefits:**
✅ Lower tax liability
✅ Reduced compliance burden
✅ No audit requirement
✅ Simple ITR filing

### Section 44ADA: For Professionals
- Gross receipts up to ₹50 lakhs
- Deemed profit: **50% of receipts**
- Applicable to doctors, lawyers, CAs, etc.

### Section 44AE: For Transport Business
- Fixed income per vehicle
- ₹7,500 per month per heavy vehicle
- ₹1,000 per month per light vehicle

## GST Input Tax Credit Benefits

### What Can You Claim?
✅ Raw materials and inputs
✅ Capital goods
✅ Input services
✅ Business-related expenses

### Strategic ITC Planning
- Time purchases for maximum credit
- Ensure vendor compliance
- Reconcile GSTR-2A monthly
- Claim credit within time limits

## Home Office Deduction

**If working from home:**
- Proportionate rent (based on area used)
- Electricity and internet (business portion)
- Furniture and equipment depreciation
- Maintenance costs

**Calculation**: (Business area / Total area) × Total expense

## Vehicle Expenses

### Owned Vehicle
- Depreciation (15% for cars)
- Fuel and maintenance
- Insurance
- Driver salary

### Leased Vehicle
- Full lease rental
- Fuel (if not included)
- Maintenance (if not included)

**Pro Tip**: Keep detailed logbook for business vs. personal use!

## Employee Benefits (Tax-Efficient)

### For Employees
- Provident Fund contribution (12%)
- Health insurance
- Meal coupons (₹50/day)
- Telephone reimbursement
- Professional development

### For Employer
- All contributions are deductible
- Builds employee loyalty
- Reduces taxable profit

## Section 43B: Timing of Deductions

**Deductible only when paid:**
- Employee PF/ESI
- Bonus and commission
- Interest on loans
- Statutory dues (GST, TDS)

**Strategy**: Pay before March 31st to claim in current year!

## Bad Debts Deduction

- Write off uncollectible debts
- Must be written off in books
- No need to prove irrecoverability
- Can claim in any year

## Charitable Donations (Section 80G)

**Business Benefits:**
- 50-100% deduction
- Improves CSR image
- Must donate to approved organizations
- Keep proper documentation

## Tax Planning for Partnerships/LLPs

### Salary to Partners
- Deductible from firm's income
- Taxed in partner's hands
- Lower overall tax liability
- Must be authorized in deed

### Interest to Partners
- Up to 12% per annum
- On capital contribution
- Must be specified in deed

## Asset Purchase Timing

**Before March 31st:**
- Claim depreciation for full year
- Even if used for 1 day
- Significant tax savings
- Plan major purchases accordingly

## Tax Audit Thresholds

**Audit Required if:**
- Turnover > ₹1 crore (business)
- Gross receipts > ₹50 lakhs (profession)
- Presumptive taxation with lower profit declaration

**Avoid by:**
- Staying below threshold
- Opting for presumptive taxation
- Declaring prescribed profit percentage

## Common Mistakes to Avoid

❌ Mixing personal and business expenses
❌ Not maintaining proper documentation
❌ Missing depreciation claims
❌ Ignoring small deductions
❌ Late payment of statutory dues
❌ Not claiming ITC on time

## Record Keeping Best Practices

✅ Digital invoicing and receipts
✅ Separate business bank account
✅ Monthly expense categorization
✅ Vendor and customer documentation
✅ Asset register maintenance
✅ Regular reconciliation

## Year-End Tax Planning Checklist

**Before March 31st:**
- [ ] Pay all statutory dues
- [ ] Purchase planned assets
- [ ] Write off bad debts
- [ ] Make charitable donations
- [ ] Pay employee bonuses
- [ ] Settle vendor payments
- [ ] Review depreciation claims
- [ ] Finalize salary to partners

**Remember**: Legitimate business expenses are your best tax-saving tool!
            `
        },
        {
            id: 5,
            title: "TDS & TCS: Complete Compliance Guide",
            excerpt: "Understanding Tax Deducted at Source and Tax Collected at Source - rates, compliance, and filing requirements.",
            category: "Compliance",
            readTime: "7 min read",
            author: "Tax Consultant",
            icon: <Shield className="h-6 w-6" />,
            content: `
# TDS & TCS: Complete Compliance Guide

Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) are crucial compliance requirements. Here's everything you need to know:

## What is TDS?

TDS is tax collected by the payer at the time of making certain payments. It's an advance tax collection mechanism.

## Common TDS Sections & Rates

### Section 194A: Interest (Other than Securities)
- **Rate**: 10%
- **Threshold**: ₹40,000 (₹50,000 for senior citizens)
- **Applicable on**: Bank interest, deposits, loans

### Section 194C: Contractor Payments
- **Rate**: 1% (individual/HUF), 2% (others)
- **Threshold**: ₹30,000 (single), ₹1,00,000 (annual)
- **Applicable on**: Construction, transport, catering

### Section 194H: Commission & Brokerage
- **Rate**: 5%
- **Threshold**: ₹15,000
- **Applicable on**: Agent commission, brokerage

### Section 194I: Rent
- **Rate**: 2% (plant/machinery), 10% (land/building)
- **Threshold**: ₹2,40,000 annually
- **Applicable on**: Office rent, equipment lease

### Section 194J: Professional Fees
- **Rate**: 10% (2% for technical services)
- **Threshold**: ₹30,000
- **Applicable on**: CA, lawyer, consultant fees

### Section 192: Salary
- **Rate**: As per tax slab
- **Threshold**: Basic exemption limit
- **Applicable on**: Employee salaries

## TDS Compliance Process

### 1. Deduct TDS
- At prescribed rates
- At time of payment or credit (whichever is earlier)
- Apply threshold limits

### 2. Deposit TDS
**Due Dates:**
- Government deductors: Same day
- Others: 7th of next month
- March deductions: 30th April

### 3. Issue TDS Certificate
- Form 16/16A
- Within 15 days of filing return
- Must contain all details

### 4. File TDS Returns
**Quarterly Returns:**
- Q1 (Apr-Jun): 31st July
- Q2 (Jul-Sep): 31st October
- Q3 (Oct-Dec): 31st January
- Q4 (Jan-Mar): 31st May

## Lower/Nil TDS Certificate

**Section 197**: Apply for lower deduction
- If tax liability is lower
- Valid for one financial year
- Apply online on TRACES

**Benefits:**
✅ Better cash flow
✅ Reduced compliance
✅ No refund waiting

## TDS on Purchase of Property

**Section 194-IA:**
- **Rate**: 1%
- **Threshold**: ₹50 lakhs
- **Buyer's responsibility**
- Deposit within 30 days

## What is TCS?

Tax Collected at Source - seller collects tax from buyer on certain goods.

## TCS Applicable Transactions

### Section 206C(1H): Sale of Goods
- **Rate**: 0.1%
- **Threshold**: ₹50 lakhs (annual receipt)
- **Applicable on**: Sale exceeding ₹50 lakhs to single buyer

### Overseas Tour Packages
- **Rate**: 5% (with PAN), 10% (without PAN)
- **Threshold**: ₹7 lakhs

### Sale of Motor Vehicles
- **Rate**: 1%
- **Threshold**: ₹10 lakhs
- **Applicable on**: Vehicles above ₹10 lakhs

## TCS Compliance

### Collection & Deposit
- Collect at time of receipt
- Deposit by 7th of next month
- March collections: 30th April

### TCS Returns
- Quarterly filing
- Same due dates as TDS
- Form 27EQ

## Penalties for Non-Compliance

### Late Deduction/Collection
- Interest: 1% per month
- From due date to actual date

### Late Payment
- Interest: 1.5% per month
- Disallowance of expense

### Non-Filing of Returns
- ₹200 per day
- Minimum: Tax amount
- Prosecution possible

### Wrong PAN/No PAN
- TDS at 20% (higher rate)
- No threshold benefit

## Best Practices

✅ **Maintain TDS Register**
- Track all deductions
- Monitor thresholds
- Ensure timely payment

✅ **Verify PAN**
- Before making payment
- Use online verification
- Avoid higher TDS rate

✅ **Reconcile Regularly**
- Match 26AS with books
- Quarterly reconciliation
- Correct errors immediately

✅ **Issue Certificates Promptly**
- Don't wait for deadline
- Helps payee in tax planning
- Maintains good relations

✅ **File Returns on Time**
- Avoid penalties
- Enable certificate issuance
- Maintain compliance record

## Common Mistakes to Avoid

❌ Ignoring threshold limits
❌ Wrong TDS section application
❌ Late payment of TDS
❌ Not issuing certificates
❌ Incorrect PAN details
❌ Missing quarterly returns

## TDS Credit Claim

**For Deductee:**
1. Check Form 26AS
2. Verify in AIS/TIS
3. Claim in ITR
4. Match with certificates

**Mismatch Resolution:**
- Contact deductor
- File correction statement
- Update in next return
- Carry forward if needed

## Recent Changes

### Section 206AB & 206CCA
**Higher TDS/TCS for non-filers:**
- Rate: 2× normal or 5% (whichever is higher)
- Applicable if no ITR for 2 years
- Income > basic exemption

### Section 194Q: Purchase of Goods
- **Rate**: 0.1%
- **Threshold**: ₹50 lakhs
- **Buyer deducts** from seller
- Effective from July 1, 2021

## Digital Tools

**TRACES Portal:**
- File returns online
- Download certificates
- Track payments
- Correction statements

**e-Filing Portal:**
- View Form 26AS
- Download certificates
- Check TDS credit

**Pro Tip**: Enable SMS/email alerts for TDS credits!

## Checklist for Compliance

**Monthly:**
- [ ] Deduct TDS on payments
- [ ] Deposit by 7th
- [ ] Update TDS register

**Quarterly:**
- [ ] File TDS/TCS return
- [ ] Issue certificates
- [ ] Reconcile with 26AS

**Annually:**
- [ ] Issue Form 16 to employees
- [ ] Verify all credits claimed
- [ ] Maintain documentation

**Remember**: Timely TDS compliance saves penalties and maintains credibility!
            `
        }
    ];

    return (
        <section id="learn" className="py-20 bg-gradient-to-b from-dark via-dark-surface to-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Learn About <span className="text-primary">Taxes</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                        Comprehensive guides and articles to help you understand Indian taxation, save money legally, and stay compliant.
                    </p>
                </div>

                {/* Articles Grid */}
                {!selectedArticle ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="group bg-dark-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-dark transition-all">
                                    {article.icon}
                                </div>

                                {/* Category Badge */}
                                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full mb-3">
                                    {article.category}
                                </span>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                    {article.excerpt}
                                </p>

                                {/* Meta Info */}
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{article.readTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{article.author}</span>
                                    </div>
                                </div>

                                {/* Read More */}
                                <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Read Article</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Article Detail View */
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => setSelectedArticle(null)}
                            className="mb-8 flex items-center gap-2 text-primary hover:text-white transition-colors group"
                        >
                            <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Back to Articles</span>
                        </button>

                        {/* Article Header */}
                        <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    {selectedArticle.icon}
                                </div>
                                <span className="px-4 py-1.5 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                                    {selectedArticle.category}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {selectedArticle.title}
                            </h1>

                            <div className="flex items-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{selectedArticle.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{selectedArticle.readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 md:p-12">
                            <ArticleContent content={selectedArticle.content} />
                        </div>

                        {/* Related Articles */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-white mb-6">More Articles</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {articles
                                    .filter(a => a.id !== selectedArticle.id)
                                    .slice(0, 2)
                                    .map((article) => (
                                        <div
                                            key={article.id}
                                            onClick={() => setSelectedArticle(article)}
                                            className="bg-dark-surface border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
                                        >
                                            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full mb-3">
                                                {article.category}
                                            </span>
                                            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h4>
                                            <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center text-primary font-semibold text-sm">
                                                <span>Read More</span>
                                                <ChevronRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LearnPage;
