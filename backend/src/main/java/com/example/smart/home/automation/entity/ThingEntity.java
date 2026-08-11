package com.example.smart.home.automation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "things")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private RoomEntity roomEntity;

    @Column(nullable = false, unique = true)
    private String thingUID;

    @Column(nullable = false)
    private String thingTypeUID;

    @Column(nullable = false)
    private String label;

    private String ipAddress;

    private String macAddress;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "thingEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ThingItemsEntity> thingItemsEntityList;

}