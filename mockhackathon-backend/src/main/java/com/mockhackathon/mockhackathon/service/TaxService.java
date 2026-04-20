package com.mockhackathon.mockhackathon.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TaxService {

    /**
     * Calculates annual tax based on the Old Regime slabs provided.
     * Slabs:
     * Up to 2,50,000: Nil
     * 2,50,001 - 5,00,000: 5%
     * 5,00,001 - 10,00,000: 20%
     * Above 10,00,000: 30%
     * Cess: 4% of tax
     */
    public BigDecimal calculateAnnualTax(BigDecimal taxableIncome) {
        if (taxableIncome.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;

        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal income = taxableIncome;

        // Above 10L
        if (income.compareTo(new BigDecimal("1000000")) > 0) {
            BigDecimal taxableAt30 = income.subtract(new BigDecimal("1000000"));
            tax = tax.add(taxableAt30.multiply(new BigDecimal("0.30")));
            income = new BigDecimal("1000000");
        }

        // 5L to 10L
        if (income.compareTo(new BigDecimal("500000")) > 0) {
            BigDecimal taxableAt20 = income.subtract(new BigDecimal("500000"));
            tax = tax.add(taxableAt20.multiply(new BigDecimal("0.20")));
            income = new BigDecimal("500000");
        }

        // 2.5L to 5L
        if (income.compareTo(new BigDecimal("250000")) > 0) {
            BigDecimal taxableAt5 = income.subtract(new BigDecimal("250000"));
            tax = tax.add(taxableAt5.multiply(new BigDecimal("0.05")));
        }

        return tax.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateCess(BigDecimal taxAmount) {
        return taxAmount.multiply(new BigDecimal("0.04")).setScale(2, RoundingMode.HALF_UP);
    }
}
