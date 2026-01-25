"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
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
							<Input
								placeholder="Título"
								value={slide.title}
								onChange={(e) => updateSlide(i, "title", e.target.value)}
							/>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label className="text-xs">Tipo</Label>
									<select
										value={slide.type}
										onChange={(e) => updateSlide(i, "type", e.target.value)}
										className="w-full h-10 px-3 rounded-md border bg-background"
									>
										<option value="video">Video</option>
										<option value="image">Imagen</option>
									</select>
								</div>
								<div className="space-y-2">
									<Label className="text-xs">
										{slide.type === "video" ? "Video" : "Imagen"}
									</Label>
									<FileUpload
										value={slide.src}
										onChange={(src) => updateSlide(i, "src", src)}
										accept={
											slide.type === "video"
												? "video/mp4,video/webm,video/quicktime"
												: "image/*"
										}
										placeholder={
											slide.type === "video" ? "Subir video" : "Subir imagen"
										}
										folder="hero"
									/>
								</div>
							</div>
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
