package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.RuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface RuleJpaRepository extends JpaRepository<RuleEntity, Long> {

    @Modifying(flushAutomatically = true)
    @Query("""
            UPDATE RuleEntity ref
            SET ref.status = :status,
            ref.updatedAt = :updatedAt
            WHERE ref.ruleUID = :ruleUID
            """)
    int updateRuleByRuleUID(
            @Param("ruleUID") String ruleUID,
            @Param("status") String status,
            @Param("updatedAt") Instant updatedAt
    );

    int deleteByRuleUID(String ruleUID);

    boolean existsByRuleName(String ruleName);
    
    // Rules (modes/schedulers) have no FK to a device — they only store the
    // item name inside triggerJson/actionsJson. itemName is unique per device
    // channel, so this is a safe best-effort way to find rules that reference
    // a channel belonging to the device being deleted.
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
            DELETE FROM RuleEntity r
            WHERE r.triggerJson LIKE CONCAT('%', :itemName, '%')
               OR r.actionsJson LIKE CONCAT('%', :itemName, '%')
            """)
    int deleteAllReferencingItemName(@Param("itemName") String itemName);
    
}