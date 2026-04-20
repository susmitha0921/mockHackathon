package com.mockhackathon.mockhackathon.service;

import com.mockhackathon.mockhackathon.entity.SalaryStructure;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class SalaryCalculationService {

    /**
     * Gross Earnings = Basic + HRA + DA + Special Allowance + Bonus (monthly portion)
     */
    public BigDecimal calculateGrossEarnings(SalaryStructure structure) {
        BigDecimal gross = BigDecimal.ZERO;
        gross = gross.add(structure.getBasicSalary());
        gross = gross.add(structure.getHra() != null ? structure.getHra() : BigDecimal.ZERO);
        gross = gross.add(structure.getDa() != null ? structure.getDa() : BigDecimal.ZERO);
        gross = gross.add(structure.getSpecialAllowance() != null ? structure.getSpecialAllowance() : BigDecimal.ZERO);
        // Annual bonus divided by 12 for monthly portion if part of monthly gross
        gross = gross.add(structure.getBonus() != null ? structure.getBonus().divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        return gross;
    }

    /**
     * PF deduction: 12% of basic + DA
     */
    public BigDecimal calculatePF(BigDecimal basic, BigDecimal da) {
        BigDecimal combined = basic.add(da != null ? da : BigDecimal.ZERO);
        return combined.multiply(new BigDecimal("0.12")).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * ESI deduction: 0.75% of gross (if gross <= 21,000)
     */
    public BigDecimal calculateESI(BigDecimal gross) {
        if (gross.compareTo(new BigDecimal("21000")) <= 0) {
            return gross.multiply(new BigDecimal("0.0075")).setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    /**
     * Professional Tax: 200 per month
     */
    public BigDecimal calculatePT(BigDecimal gross) {
        // PT is usually slab based but requirement says 200 per month
        return new BigDecimal("200.00");
    }
}
