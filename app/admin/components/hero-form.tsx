"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/config/site-content";

interface HeroFormProps {
	data: SiteContent["hero"];
	onChange: (d: unknown) => void;
}

export function HeroForm({ data, onChange }: HeroFormProps) {
	const updateSlide = (index: number, field: string, value: string) => {
		const newSlides = [...data.slides];
		newSlides[index] = { ...newSlides[index], [field]: value };
		onChange({ ...data, slides: newSlides });
	};

	const updateSocialProof = (index: number, field: string, value: string) => {
		const newSocialProof = [...data.socialProof];
		newSocialProof[index] = { ...newSocialProof[index], [field]: value };
		onChange({ ...data, socialProof: newSocialProof });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Configuración del Hero</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<Label>Slides</Label>
					{data.slides.map((slide, i) => (
						<div key={slide.id} className="border p-4 rounded-lg space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<Input
									placeholder="Título"
									value={slide.title}
									onChange={(e) => updateSlide(i, "title", e.target.value)}
								/>
								<Input
									placeholder="Tipo (video/image)"
									value={slide.type}
									onChange={(e) => updateSlide(i, "type", e.target.value)}
								/>
							</div>
							<Input
								placeholder="SRC (URL del video/imagen)"
								value={slide.src}
								onChange={(e) => updateSlide(i, "src", e.target.value)}
							/>
							<Input
								placeholder="Subtítulo"
								value={slide.subtitle}
								onChange={(e) => updateSlide(i, "subtitle", e.target.value)}
							/>
						</div>
					))}
				</div>

				<div className="space-y-4">
					<Label>Social Proof</Label>
					{data.socialProof.map((item, i) => (
						<div key={item.label} className="flex gap-2">
							<Input
								placeholder="Valor (ej: 500+)"
								value={item.value}
								onChange={(e) => updateSocialProof(i, "value", e.target.value)}
							/>
							<Input
								placeholder="Label"
								value={item.label}
								onChange={(e) => updateSocialProof(i, "label", e.target.value)}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
